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
  updatePlayerBalanceOnline,
  broadcastDiceRollOnline,
  broadcastFinishRoundOnline,
  giveCoinsToPlayerOnline,
  updatePlayerNameOnline,
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
  roomPin: string;
  tablePlayers: string[];
  isOnline: boolean;
  isHost: boolean;
  playerId: string;
  playerName: string;
  onlinePlayers: OnlinePlayer[];
  lastHandledRollId: string | null;

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
  createOnlineRoomAction: (pin?: string) => Promise<string>;
  joinOnlineRoomAction: (roomId: string, pin?: string) => Promise<{ success: boolean; error?: string }>;
  leaveOnlineRoomAction: () => Promise<void>;
  setPlayerName: (name: string) => void;
  updatePlayerNameAction: (newName: string) => Promise<void>;
  giveCoinsAction: (targetPlayerId: string, amount: number) => Promise<void>;
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
  roomPin: '',
  tablePlayers: ['Sokha', 'Dara', 'Chantrea', 'Bopha'],
  isOnline: false,
  isHost: true,
  playerId: initialPlayerId,
  playerName: '',
  onlinePlayers: [],
  lastHandledRollId: null,

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
    const { balance, currentBets, selectedChip, settings, gamePhase, isOnline, isHost } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && isHost) return; // Host cannot bet for themselves in online multiplayer!

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
      updatePlayerBetsOnline(get().roomId, get().playerId, newBets, newBalance);
    }
  },

  removeBet: (symbol: SymbolId) => {
    const { balance, currentBets, gamePhase, isOnline, isHost } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && isHost) return;

    const currentSymbolBet = currentBets[symbol] || 0;
    if (currentSymbolBet <= 0) return;

    const refundAmount = currentSymbolBet;
    const newBets = { ...currentBets };
    delete newBets[symbol];

    const newTotalBet = Object.values(newBets).reduce((a, b) => a + (b || 0), 0);
    const newBal = balance + refundAmount;

    Sound.playButtonClick();

    set({
      currentBets: newBets,
      balance: newBal,
      totalBetAmount: newTotalBet,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, newBets, newBal);
    }
  },

  clearBets: () => {
    const { balance, currentBets, gamePhase, isOnline, isHost } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && isHost) return;

    const refundTotal = Object.values(currentBets).reduce((a, b) => a + (b || 0), 0);
    if (refundTotal <= 0) return;

    const newBal = balance + refundTotal;
    Sound.playButtonClick();

    set({
      currentBets: {},
      balance: newBal,
      totalBetAmount: 0,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, {}, newBal);
    }
  },

  doubleBets: () => {
    const { balance, currentBets, gamePhase, settings, isOnline, isHost } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && isHost) return;

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

    const newBal = balance - cost;
    Sound.playChipBet();

    set({
      currentBets: doubledBets,
      balance: newBal,
      totalBetAmount: newTotal,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, doubledBets, newBal);
    }
  },

  rebet: () => {
    const { balance, previousBets, gamePhase, isOnline, isHost } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && isHost) return;

    const neededTotal = Object.values(previousBets).reduce((a, b) => a + (b || 0), 0);
    if (neededTotal <= 0 || balance < neededTotal) return;

    const { currentBets } = get();
    const currentRefund = Object.values(currentBets).reduce((a, b) => a + (b || 0), 0);
    const newBal = balance + currentRefund - neededTotal;

    Sound.playChipBet();

    set({
      currentBets: { ...previousBets },
      balance: newBal,
      totalBetAmount: neededTotal,
    });

    if (get().isOnline) {
      updatePlayerBetsOnline(get().roomId, get().playerId, previousBets, newBal);
    }
  },

  startRoll: () => {
    const { currentBets, totalBetAmount, gamePhase, settings, isOnline, isHost, roomId } = get();
    if (gamePhase !== 'betting') return;
    if (isOnline && !isHost) return;
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

      const { balance, stats, history, isOnline, isHost, onlinePlayers } = get();
      let finalBalance = balance + roundResult.totalPayout;
      let hostNet = 0;

      if (isOnline && isHost) {
        // Dealer settlement: Host collects all losing bets and pays out winnings
        const guests = (onlinePlayers || []).filter((p) => !p.isHost);
        hostNet = guests.reduce((acc, p) => {
          if (!p.bets || Object.keys(p.bets).length === 0) return acc;
          const pRes = calculateRoundResult(roundNumber, p.bets, targetDice);
          return acc - pRes.netProfit;
        }, 0);
        finalBalance = Math.max(0, balance + hostNet);
      }

      // Update statistics
      const isRoundWin = isOnline && isHost ? hostNet > 0 : roundResult.isWin;
      const roundNetWon = isOnline && isHost ? hostNet : roundResult.netProfit;
      const newWon = stats.roundsWon + (isRoundWin ? 1 : 0);
      const newLost = stats.roundsLost + (isRoundWin ? 0 : 1);
      const newStreak = isRoundWin ? stats.currentStreak + 1 : 0;
      const bestStreak = Math.max(stats.bestStreak, newStreak);
      const maxWin = Math.max(stats.maxWinSingleRound, roundNetWon);

      const newStats: PlayerStats = {
        totalRounds: stats.totalRounds + 1,
        roundsWon: newWon,
        roundsLost: newLost,
        totalBetAmount: stats.totalBetAmount + roundResult.totalBet,
        totalWonAmount: stats.totalWonAmount + Math.max(0, roundNetWon),
        maxWinSingleRound: maxWin,
        currentStreak: newStreak,
        bestStreak: bestStreak,
      };

      const newHistory = [roundResult, ...history.slice(0, 49)];

      // Persist to storage
      StorageService.saveWallet(finalBalance);
      StorageService.saveStats(newStats);
      StorageService.saveHistory(newHistory);

      if (isOnline && isHost) {
        if (hostNet > 0) {
          Sound.playWinFanfare();
        } else if (hostNet < 0) {
          Sound.playLoseSound();
        }
      } else {
        if (roundResult.isWin) {
          Sound.playWinFanfare();
        } else if (roundResult.totalBet > 0) {
          Sound.playLoseSound();
        }
      }

      set({
        gamePhase: 'result',
        currentResult: roundResult,
        balance: finalBalance,
        stats: newStats,
        history: newHistory,
        showResultModal: true,
      });

      if (get().isOnline) {
        updatePlayerBalanceOnline(get().roomId, get().playerId, finalBalance);
      }
    }, 1500);
  },

  closeResultModal: () => {
    const { roundNumber, isOnline, isHost, roomId, balance } = get();
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
      updatePlayerBetsOnline(roomId, get().playerId, {}, balance);
      if (isHost) {
        broadcastFinishRoundOnline(roomId, nextRound);
      }
    }
  },

  claimFreeCoins: () => {
    // Feature temporarily disabled per user request
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

  createOnlineRoomAction: async (pin?: string) => {
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }

    const { playerId, playerName, balance } = get();
    const effectiveHostName = playerName.trim() || 'Ly Kimsan';
    const newRoomId = await createOnlineRoom(
      {
        id: playerId,
        name: effectiveHostName,
        avatar: '👑',
        balance,
      },
      pin
    );

    set({
      isOnline: true,
      isHost: true,
      roomId: newRoomId,
      roomPin: pin?.trim() || '',
      playerName: effectiveHostName,
      currentBets: {},
      totalBetAmount: 0,
      lastHandledRollId: null,
    });

    roomUnsubscribe = subscribeToOnlineRoom(newRoomId, (room) => {
      if (!room) return;
      const players = Object.values(room.players || {});
      const amHost = room.hostId === get().playerId;

      set({
        onlinePlayers: players,
        tablePlayers: players.map((p) => p.name),
        roundNumber: room.roundNumber || get().roundNumber,
      });

      // Synchronize Roll Trigger via unique rollId
      if (
        room.status === 'rolling' &&
        room.diceResult &&
        room.rollId &&
        room.rollId !== get().lastHandledRollId &&
        !amHost
      ) {
        set({ lastHandledRollId: room.rollId });
        get().executeSynchronizedRoll(room.diceResult);
      }
    });

    return newRoomId;
  },

  joinOnlineRoomAction: async (targetRoomId: string, inputPin?: string) => {
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }

    const { playerId, playerName, balance } = get();
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      return { success: false, error: 'សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន! (Please enter your name first!)' };
    }

    const result = await joinOnlineRoom(
      targetRoomId,
      {
        id: playerId,
        name: trimmedName,
        avatar: '🎲',
        balance,
      },
      inputPin
    );

    if (!result.success) {
      return result;
    }

    set({
      isOnline: true,
      isHost: false,
      roomId: targetRoomId,
      balance: 0, // Guest participants start with 0 coins until host grants them!
      currentBets: {},
      totalBetAmount: 0,
      lastHandledRollId: null,
    });

    roomUnsubscribe = subscribeToOnlineRoom(targetRoomId, (room) => {
      if (!room) return;
      const players = Object.values(room.players || {});
      const amHost = room.hostId === get().playerId;
      const myPlayer = room.players?.[get().playerId];

      set({
        onlinePlayers: players,
        tablePlayers: players.map((p) => p.name),
        isHost: amHost,
        roomPin: room.pin || '',
        roundNumber: room.roundNumber || get().roundNumber,
      });

      // Synchronize balance from room if guest (so Host giving coins updates guest balance immediately!)
      if (!amHost && myPlayer && typeof myPlayer.balance === 'number') {
        const currentBal = get().balance;
        if (myPlayer.balance !== currentBal && get().gamePhase === 'betting') {
          set({ balance: myPlayer.balance });
          if (myPlayer.balance > currentBal) {
            Sound.playWinFanfare();
          }
        }
      }

      // Synchronize Roll Trigger via unique rollId
      if (
        room.status === 'rolling' &&
        room.diceResult &&
        room.rollId &&
        room.rollId !== get().lastHandledRollId &&
        !amHost
      ) {
        set({ lastHandledRollId: room.rollId });
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
    const localWallet = await StorageService.getWallet();

    set({
      isOnline: false,
      isHost: true,
      roomId: '122',
      roomPin: '',
      tablePlayers: ['Sokha', 'Dara', 'Chantrea', 'Bopha'],
      onlinePlayers: [],
      balance: localWallet,
      currentBets: {},
      totalBetAmount: 0,
      lastHandledRollId: null,
    });
  },

  setPlayerName: (name: string) => {
    set({ playerName: name });
  },

  updatePlayerNameAction: async (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    set({ playerName: trimmed });
    if (get().isOnline) {
      await updatePlayerNameOnline(get().roomId, get().playerId, trimmed);
    }
  },

  giveCoinsAction: async (targetPlayerId: string, amount: number) => {
    const { roomId, isHost } = get();
    if (!isHost) return;
    await giveCoinsToPlayerOnline(roomId, targetPlayerId, amount);
    Sound.playWinFanfare();
  },
}));
