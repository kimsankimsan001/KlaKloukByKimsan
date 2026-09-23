import { create } from 'zustand';
import {
  BetMap,
  DiceResult,
  GamePhase,
  GameSettings,
  PlayerStats,
  RoundResult,
  SymbolId,
} from '../types';
import { calculateRoundResult, rollThreeDice } from '../services/gameLogic';
import { StorageService, DEFAULT_STARTING_BALANCE } from '../services/storage';
import { Sound } from '../services/soundManager';
import {
  OnlinePlayer,
  createOnlineRoom,
  joinOnlineRoom,
  leaveOnlineRoom,
  subscribeToOnlineRoom,
  updatePlayerBetsOnline,
  broadcastDiceRollOnline,
  broadcastFinishRoundOnline,
} from '../services/multiplayerService';

let roomUnsubscribe: (() => void) | null = null;
const initialPlayerId = 'player_' + Math.random().toString(36).substring(2, 9);

interface GameState {
  // Wallet & Bets
  balance: number;
  currentBets: BetMap;
  previousBets: BetMap;
  selectedChip: number;
  totalBetAmount: number;

  // Dice & Flow
  roundNumber: number;
  gamePhase: GamePhase;
  currentDice: DiceResult;
  revealedDiceCount: number;
  currentResult: RoundResult | null;
  showResultModal: boolean;

  // History & Statistics
  history: RoundResult[];
  stats: PlayerStats;

  // Settings
  settings: GameSettings;
  isInitialized: boolean;

  // Room / Table (Multiplayer Architecture)
  roomId: string;
  tablePlayers: string[];
  isOnline: boolean;
  isHost: boolean;
  playerId: string;
  playerName: string;
  onlinePlayers: OnlinePlayer[];

  // Actions
  initialize: () => Promise<void>;
  selectChip: (chip: number) => void;
  placeBet: (symbol: SymbolId) => void;
  removeBet: (symbol: SymbolId) => void;
  clearBets: () => void;
  doubleBets: () => void;
  rebet: () => void;
  startRoll: () => void;
  executeSynchronizedRoll: (targetDice: DiceResult) => void;
  closeResultModal: () => void;
  claimFreeCoins: () => void;
  resetWallet: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  createOnlineRoomAction: () => Promise<string>;
  joinOnlineRoomAction: (roomId: string) => Promise<{ success: boolean; error?: string }>;
  leaveOnlineRoomAction: () => Promise<void>;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: DEFAULT_STARTING_BALANCE,
  currentBets: {},
  previousBets: {},
  selectedChip: 100,
  totalBetAmount: 0,

  roundNumber: 1,
  gamePhase: 'betting',
  currentDice: ['tiger', 'calabash', 'rooster'],
  revealedDiceCount: 3, // Initially shown on table
  currentResult: null,
  showResultModal: false,

  history: [],
  stats: {
    totalRounds: 0,
    roundsWon: 0,
    roundsLost: 0,
    totalBetAmount: 0,
    totalWonAmount: 0,
    maxWinSingleRound: 0,
    currentStreak: 0,
    bestStreak: 0,
  },

  settings: {
    soundEnabled: true,
    musicEnabled: false,
    hapticEnabled: true,
    language: 'km',
    symbolVariant: 'calabash',
    minBet: 10,
    maxBet: 50000,
  },
  isInitialized: false,

  roomId: '122',
  tablePlayers: ['Sokha', 'Dara', 'Chantrea', 'Bopha'],
  isOnline: false,
  isHost: true,
  playerId: initialPlayerId,
  playerName: 'Ly Kimsan',
  onlinePlayers: [],

  initialize: async () => {
    if (get().isInitialized) return;
    const [balance, history, stats, settings] = await Promise.all([
      StorageService.getWallet(),
      StorageService.getHistory(),
      StorageService.getStats(),
      StorageService.getSettings(),
    ]);

    Sound.setSoundEnabled(settings.soundEnabled);
    Sound.setMusicEnabled(settings.musicEnabled);
    Sound.setHapticsEnabled(settings.hapticEnabled);

    set({
      balance,
      history,
      stats,
      settings,
      roundNumber: history.length > 0 ? history[0].roundId + 1 : 1,
      isInitialized: true,
    });
  },

  selectChip: (chip: number) => {
    Sound.playButtonClick();
    set({ selectedChip: chip });
  },

  placeBet: (symbol: SymbolId) => {
    const { balance, currentBets, selectedChip, settings, gamePhase } = get();
    if (gamePhase !== 'betting') return;

    if (balance < selectedChip) {
      Sound.playLoseSound();
      return;
    }

    const currentSymbolBet = currentBets[symbol] || 0;
    if (currentSymbolBet + selectedChip > settings.maxBet) {
      return;
    }

    const newBets: BetMap = {
      ...currentBets,
      [symbol]: currentSymbolBet + selectedChip,
    };

    const newTotalBet = Object.values(newBets).reduce((a, b) => a + (b || 0), 0);
    const newBalance = balance - selectedChip;

    Sound.playChipBet();

    set({
      currentBets: newBets,
      balance: newBalance,
      totalBetAmount: newTotalBet,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, newBets);
    }
  },

  removeBet: (symbol: SymbolId) => {
    const { balance, currentBets, gamePhase } = get();
    if (gamePhase !== 'betting') return;

    const currentSymbolBet = currentBets[symbol] || 0;
    if (currentSymbolBet <= 0) return;

    const refundAmount = currentSymbolBet;
    const newBets = { ...currentBets };
    delete newBets[symbol];

    const newTotalBet = Object.values(newBets).reduce((a, b) => a + (b || 0), 0);

    Sound.playButtonClick();

    set({
      currentBets: newBets,
      balance: balance + refundAmount,
      totalBetAmount: newTotalBet,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, newBets);
    }
  },

  clearBets: () => {
    const { balance, currentBets, gamePhase } = get();
    if (gamePhase !== 'betting') return;

    const refundTotal = Object.values(currentBets).reduce((a, b) => a + (b || 0), 0);
    if (refundTotal <= 0) return;

    Sound.playButtonClick();

    set({
      currentBets: {},
      balance: balance + refundTotal,
      totalBetAmount: 0,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, {});
    }
  },

  doubleBets: () => {
    const { balance, currentBets, gamePhase, settings } = get();
    if (gamePhase !== 'betting') return;

    const currentTotal = Object.values(currentBets).reduce((a, b) => a + (b || 0), 0);
    if (currentTotal <= 0 || balance < currentTotal) return;

    const doubledBets: BetMap = {};
    for (const [k, v] of Object.entries(currentBets)) {
      if (v) {
        doubledBets[k as SymbolId] = Math.min(v * 2, settings.maxBet);
      }
    }

    const newTotal = Object.values(doubledBets).reduce((a, b) => a + (b || 0), 0);
    const cost = newTotal - currentTotal;
    if (balance < cost) return;

    Sound.playChipBet();

    set({
      currentBets: doubledBets,
      balance: balance - cost,
      totalBetAmount: newTotal,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, doubledBets);
    }
  },

  rebet: () => {
    const { balance, previousBets, gamePhase } = get();
    if (gamePhase !== 'betting') return;

    const neededTotal = Object.values(previousBets).reduce((a, b) => a + (b || 0), 0);
    if (neededTotal <= 0 || balance < neededTotal) return;

    const { currentBets } = get();
    const currentRefund = Object.values(currentBets).reduce((a, b) => a + (b || 0), 0);

    Sound.playChipBet();

    set({
      currentBets: { ...previousBets },
      balance: balance + currentRefund - neededTotal,
      totalBetAmount: neededTotal,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, previousBets);
    }
  },

  startRoll: () => {
    const { currentBets, totalBetAmount, gamePhase, settings, isOnline, isHost, roomId } = get();
    if (gamePhase !== 'betting') return;
    if (!isOnline && totalBetAmount <= 0) return;

    // Generate fair random outcome
    const targetDice = rollThreeDice(settings.symbolVariant);

    if (isOnline && isHost) {
      broadcastDiceRollOnline(roomId, targetDice);
    }

    get().executeSynchronizedRoll(targetDice);
  },

  executeSynchronizedRoll: (targetDice: DiceResult) => {
    const { currentBets, roundNumber } = get();
    const prevBets = { ...currentBets };

    // 1. Shaking phase
    set({
      gamePhase: 'shaking',
      revealedDiceCount: 0,
      previousBets: prevBets,
    });

    Sound.playDiceShake(1600);

    // 2. Staggered reveal phase (Dice 1 @ 500ms, Dice 2 @ 1000ms, Dice 3 @ 1500ms)
    setTimeout(() => {
      set({ currentDice: targetDice, revealedDiceCount: 1 });
      Sound.playDiceReveal(1);
    }, 500);

    setTimeout(() => {
      set({ revealedDiceCount: 2 });
      Sound.playDiceReveal(2);
    }, 1000);

    setTimeout(() => {
      set({ revealedDiceCount: 3 });
      Sound.playDiceReveal(3);

      // 3. Finalize round result
      const roundResult = calculateRoundResult(roundNumber, prevBets, targetDice);

      const { balance, stats, history } = get();
      const updatedBalance = balance + roundResult.totalPayout;

      // Update statistics
      const newWon = stats.roundsWon + (roundResult.isWin ? 1 : 0);
      const newLost = stats.roundsLost + (roundResult.isWin ? 0 : 1);
      const newStreak = roundResult.isWin ? stats.currentStreak + 1 : 0;
      const bestStreak = Math.max(stats.bestStreak, newStreak);
      const maxWin = Math.max(stats.maxWinSingleRound, roundResult.netProfit);

      const newStats: PlayerStats = {
        totalRounds: stats.totalRounds + 1,
        roundsWon: newWon,
        roundsLost: newLost,
        totalBetAmount: stats.totalBetAmount + roundResult.totalBet,
        totalWonAmount: stats.totalWonAmount + Math.max(0, roundResult.netProfit),
        maxWinSingleRound: maxWin,
        currentStreak: newStreak,
        bestStreak: bestStreak,
      };

      const newHistory = [roundResult, ...history.slice(0, 49)];

      // Persist to storage
      StorageService.saveWallet(updatedBalance);
      StorageService.saveStats(newStats);
      StorageService.saveHistory(newHistory);

      if (roundResult.isWin) {
        Sound.playWinFanfare();
      } else if (roundResult.totalBet > 0) {
        Sound.playLoseSound();
      }

      set({
        gamePhase: 'result',
        currentResult: roundResult,
        balance: updatedBalance,
        stats: newStats,
        history: newHistory,
        showResultModal: true,
      });
    }, 1500);
  },

  closeResultModal: () => {
    const { roundNumber, isOnline, isHost, roomId } = get();
    Sound.playButtonClick();
    const nextRound = roundNumber + 1;

    set({
      showResultModal: false,
      gamePhase: 'betting',
      currentBets: {},
      totalBetAmount: 0,
      roundNumber: nextRound,
    });

    if (isOnline) {
      updatePlayerBetsOnline(roomId, get().playerId, {});
      if (isHost) {
        broadcastFinishRoundOnline(roomId, nextRound);
      }
    }
  },

  claimFreeCoins: () => {
    const { balance } = get();
    const bonus = 3000;
    const newBal = balance + bonus;
    StorageService.saveWallet(newBal);
    Sound.playWinFanfare();
    set({ balance: newBal });
  },

  resetWallet: () => {
    StorageService.saveWallet(DEFAULT_STARTING_BALANCE);
    Sound.playButtonClick();
    set({ balance: DEFAULT_STARTING_BALANCE, currentBets: {}, totalBetAmount: 0 });
  },

  updateSettings: (newSettings: Partial<GameSettings>) => {
    const merged = { ...get().settings, ...newSettings };
    Sound.setSoundEnabled(merged.soundEnabled);
    Sound.setMusicEnabled(merged.musicEnabled);
    Sound.setHapticsEnabled(merged.hapticEnabled);
    StorageService.saveSettings(merged);
    set({ settings: merged });
  },

  createOnlineRoomAction: async () => {
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }

    const { playerId, playerName, balance } = get();
    const newRoomId = await createOnlineRoom({
      id: playerId,
      name: playerName,
      avatar: '👑',
      balance,
    });

    set({
      isOnline: true,
      isHost: true,
      roomId: newRoomId,
      currentBets: {},
      totalBetAmount: 0,
    });

    roomUnsubscribe = subscribeToOnlineRoom(newRoomId, (room) => {
      if (!room) return;
      const players = Object.values(room.players || {});
      set({
        onlinePlayers: players,
        tablePlayers: players.map((p) => p.name),
        roundNumber: room.roundNumber || get().roundNumber,
      });

      const currentPhase = get().gamePhase;
      if (room.status === 'rolling' && room.diceResult && currentPhase === 'betting' && !get().isHost) {
        get().executeSynchronizedRoll(room.diceResult);
      }
    });

    return newRoomId;
  },

  joinOnlineRoomAction: async (targetRoomId: string) => {
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }

    const { playerId, playerName, balance } = get();
    const result = await joinOnlineRoom(targetRoomId, {
      id: playerId,
      name: playerName,
      avatar: '🎲',
      balance,
    });

    if (!result.success) {
      return result;
    }

    set({
      isOnline: true,
      isHost: false,
      roomId: targetRoomId,
      currentBets: {},
      totalBetAmount: 0,
    });

    roomUnsubscribe = subscribeToOnlineRoom(targetRoomId, (room) => {
      if (!room) return;
      const players = Object.values(room.players || {});
      set({
        onlinePlayers: players,
        tablePlayers: players.map((p) => p.name),
        isHost: room.hostId === get().playerId,
        roundNumber: room.roundNumber || get().roundNumber,
      });

      const currentPhase = get().gamePhase;
      if (room.status === 'rolling' && room.diceResult && currentPhase === 'betting' && !get().isHost) {
        get().executeSynchronizedRoll(room.diceResult);
      }
    });

    return { success: true };
  },

  leaveOnlineRoomAction: async () => {
    const { roomId, playerId } = get();
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }
    await leaveOnlineRoom(roomId, playerId);

    set({
      isOnline: false,
      isHost: true,
      roomId: '122',
      tablePlayers: ['Sokha', 'Dara', 'Chantrea', 'Bopha'],
      onlinePlayers: [],
      currentBets: {},
      totalBetAmount: 0,
    });
  },

  setPlayerName: (name: string) => {
    set({ playerName: name });
  },
}));
