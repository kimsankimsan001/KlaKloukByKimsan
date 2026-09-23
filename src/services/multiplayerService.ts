import {
  ref,
  set,
  get,
  update,
  onValue,
  onDisconnect,
  remove,
} from 'firebase/database';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { DiceResult } from '../types';

export interface OnlinePlayer {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  isHost: boolean;
  lastActive: number;
  currentBetTotal: number;
  bets: Record<string, number>;
}

export interface OnlineRoom {
  id: string;
  hostId: string;
  hostName: string;
  pin?: string;
  status: 'betting' | 'rolling' | 'payout';
  rollId?: string;
  rollTimestamp?: number;
  diceResult?: DiceResult;
  totalBets: Record<string, number>;
  players: Record<string, OnlinePlayer>;
  updatedAt: number;
  roundNumber: number;
}

// Local mock room memory for when Firebase is not yet configured or offline practice
let localMockRoom: OnlineRoom | null = null;
let localMockSubscribers: ((room: OnlineRoom | null) => void)[] = [];

const notifyMockSubscribers = () => {
  localMockSubscribers.forEach((cb) => cb(localMockRoom ? { ...localMockRoom } : null));
};

export const createOnlineRoom = async (
  player: {
    id: string;
    name: string;
    avatar: string;
    balance: number;
  },
  pin?: string
): Promise<string> => {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  const db = getFirebaseDb();

  const hostPlayer: OnlinePlayer = {
    id: player.id,
    name: player.name?.trim() || 'Ly Kimsan',
    avatar: player.avatar || '👑',
    balance: player.balance,
    isHost: true,
    lastActive: Date.now(),
    currentBetTotal: 0,
    bets: {},
  };

  const initialRoom: OnlineRoom = {
    id: roomId,
    hostId: player.id,
    hostName: hostPlayer.name,
    pin: pin?.trim() || '',
    status: 'betting',
    totalBets: {},
    players: {
      [player.id]: hostPlayer,
    },
    updatedAt: Date.now(),
    roundNumber: 1,
  };

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    await set(roomRef, initialRoom);

    // Auto-remove player from room on disconnect
    const playerRef = ref(db, `rooms/${roomId}/players/${player.id}`);
    onDisconnect(playerRef).remove();
  } else {
    // Local fallback
    localMockRoom = initialRoom;
    notifyMockSubscribers();
  }

  return roomId;
};

export const joinOnlineRoom = async (
  roomId: string,
  player: {
    id: string;
    name: string;
    avatar: string;
    balance?: number;
  },
  inputPin?: string
): Promise<{ success: boolean; error?: string }> => {
  const trimmedName = player.name?.trim();
  if (!trimmedName) {
    return { success: false, error: 'សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន! (Please enter your name first!)' };
  }

  const db = getFirebaseDb();

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'បន្ទប់ល្បែងមិនត្រឹមត្រូវ ឬបានបិទ (Room not found)' };
    }

    const roomData = snapshot.val() as OnlineRoom;
    const isHost = roomData.hostId === player.id;

    // Check PIN if room is password protected and user is not host
    if (!isHost && roomData.pin && roomData.pin.trim() !== '') {
      if ((inputPin || '').trim() !== roomData.pin.trim()) {
        return { success: false, error: 'លេខសំងាត់តុមិនត្រឹមត្រូវ! (Incorrect Table PIN!)' };
      }
    }

    // Participants start with 0 balance upon joining unless host or rejoining
    const existingPlayer = roomData.players?.[player.id];
    const initialBalance = isHost
      ? (player.balance ?? 10000)
      : (existingPlayer ? existingPlayer.balance : 0);

    const joiningPlayer: OnlinePlayer = {
      id: player.id,
      name: trimmedName,
      avatar: player.avatar || (isHost ? '👑' : '🎲'),
      balance: initialBalance,
      isHost,
      lastActive: Date.now(),
      currentBetTotal: existingPlayer?.currentBetTotal || 0,
      bets: existingPlayer?.bets || {},
    };

    const playerRef = ref(db, `rooms/${roomId}/players/${player.id}`);
    await set(playerRef, joiningPlayer);
    onDisconnect(playerRef).remove();

    return { success: true };
  } else {
    // Local simulated join
    if (!localMockRoom || localMockRoom.id !== roomId) {
      localMockRoom = {
        id: roomId,
        hostId: 'host-1',
        hostName: 'Ly Kimsan',
        pin: '',
        status: 'betting',
        totalBets: {},
        players: {
          'host-1': {
            id: 'host-1',
            name: 'Ly Kimsan',
            avatar: '👑',
            balance: 50000,
            isHost: true,
            lastActive: Date.now(),
            currentBetTotal: 0,
            bets: {},
          },
          [player.id]: {
            id: player.id,
            name: trimmedName,
            avatar: player.avatar || '🎲',
            balance: 0, // Participants start with 0
            isHost: false,
            lastActive: Date.now(),
            currentBetTotal: 0,
            bets: {},
          },
        },
        updatedAt: Date.now(),
        roundNumber: 1,
      };
    } else {
      const isHost = localMockRoom.hostId === player.id;
      if (!isHost && localMockRoom.pin && localMockRoom.pin.trim() !== '') {
        if ((inputPin || '').trim() !== localMockRoom.pin.trim()) {
          return { success: false, error: 'លេខសំងាត់តុមិនត្រឹមត្រូវ! (Incorrect Table PIN!)' };
        }
      }

      const existingPlayer = localMockRoom.players[player.id];
      localMockRoom.players[player.id] = {
        id: player.id,
        name: trimmedName,
        avatar: player.avatar || (isHost ? '👑' : '🎲'),
        balance: isHost ? (player.balance ?? 10000) : (existingPlayer ? existingPlayer.balance : 0),
        isHost,
        lastActive: Date.now(),
        currentBetTotal: existingPlayer?.currentBetTotal || 0,
        bets: existingPlayer?.bets || {},
      };
    }
    notifyMockSubscribers();
    return { success: true };
  }
};

export const giveCoinsToPlayerOnline = async (
  roomId: string,
  targetPlayerId: string,
  amount: number
): Promise<void> => {
  const db = getFirebaseDb();
  if (db && isFirebaseConfigured()) {
    const targetRef = ref(db, `rooms/${roomId}/players/${targetPlayerId}`);
    const snapshot = await get(targetRef);
    if (snapshot.exists()) {
      const currentData = snapshot.val() as OnlinePlayer;
      const newBal = (currentData.balance || 0) + amount;
      await update(targetRef, {
        balance: newBal,
        lastActive: Date.now(),
      });
    }
  } else {
    if (localMockRoom && localMockRoom.players[targetPlayerId]) {
      localMockRoom.players[targetPlayerId].balance += amount;
      localMockRoom.players[targetPlayerId].lastActive = Date.now();
      notifyMockSubscribers();
    }
  }
};

export const updatePlayerNameOnline = async (
  roomId: string,
  playerId: string,
  newName: string
): Promise<void> => {
  const trimmed = newName.trim();
  if (!trimmed) return;

  const db = getFirebaseDb();
  if (db && isFirebaseConfigured()) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await update(playerRef, {
      name: trimmed,
      lastActive: Date.now(),
    });
  } else {
    if (localMockRoom && localMockRoom.players[playerId]) {
      localMockRoom.players[playerId].name = trimmed;
      localMockRoom.players[playerId].lastActive = Date.now();
      notifyMockSubscribers();
    }
  }
};

export const leaveOnlineRoom = async (roomId: string, playerId: string): Promise<void> => {
  const db = getFirebaseDb();
  if (db && isFirebaseConfigured()) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await remove(playerRef);
  } else {
    if (localMockRoom && localMockRoom.players[playerId]) {
      delete localMockRoom.players[playerId];
      notifyMockSubscribers();
    }
  }
};

export const subscribeToOnlineRoom = (
  roomId: string,
  onUpdate: (room: OnlineRoom | null) => void
): (() => void) => {
  const db = getFirebaseDb();

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val() as OnlineRoom;
        if (!val.players) val.players = {};
        if (!val.totalBets) val.totalBets = {};
        onUpdate(val);
      } else {
        onUpdate(null);
      }
    });

    return () => unsubscribe();
  } else {
    localMockSubscribers.push(onUpdate);
    onUpdate(localMockRoom);

    return () => {
      localMockSubscribers = localMockSubscribers.filter((cb) => cb !== onUpdate);
    };
  }
};

export const updatePlayerBetsOnline = async (
  roomId: string,
  playerId: string,
  bets: Record<string, number>,
  balance?: number
): Promise<void> => {
  const totalAmount = Object.values(bets).reduce((a, b) => a + b, 0);
  const db = getFirebaseDb();

  const updateData: any = {
    bets,
    currentBetTotal: totalAmount,
    lastActive: Date.now(),
  };
  if (typeof balance === 'number') {
    updateData.balance = balance;
  }

  if (db && isFirebaseConfigured()) {
    const playerBetsRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await update(playerBetsRef, updateData);
  } else {
    if (localMockRoom && localMockRoom.players[playerId]) {
      localMockRoom.players[playerId].bets = bets;
      localMockRoom.players[playerId].currentBetTotal = totalAmount;
      if (typeof balance === 'number') {
        localMockRoom.players[playerId].balance = balance;
      }
      localMockRoom.players[playerId].lastActive = Date.now();
      notifyMockSubscribers();
    }
  }
};

export const updatePlayerBalanceOnline = async (
  roomId: string,
  playerId: string,
  balance: number
): Promise<void> => {
  const db = getFirebaseDb();
  if (db && isFirebaseConfigured()) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await update(playerRef, {
      balance,
      lastActive: Date.now(),
    });
  } else {
    if (localMockRoom && localMockRoom.players[playerId]) {
      localMockRoom.players[playerId].balance = balance;
      localMockRoom.players[playerId].lastActive = Date.now();
      notifyMockSubscribers();
    }
  }
};

export const broadcastDiceRollOnline = async (
  roomId: string,
  diceResult: DiceResult
): Promise<void> => {
  const db = getFirebaseDb();
  const rollId = `${roomId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    await update(roomRef, {
      status: 'rolling',
      diceResult,
      rollId,
      rollTimestamp: now,
      updatedAt: now,
    });
  } else {
    if (localMockRoom) {
      localMockRoom.status = 'rolling';
      localMockRoom.diceResult = diceResult;
      localMockRoom.rollId = rollId;
      localMockRoom.rollTimestamp = now;
      localMockRoom.updatedAt = now;
      notifyMockSubscribers();
    }
  }
};

export const broadcastFinishRoundOnline = async (
  roomId: string,
  nextRoundNumber: number
): Promise<void> => {
  const db = getFirebaseDb();

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    const updates: Record<string, any> = {
      status: 'betting',
      roundNumber: nextRoundNumber,
      totalBets: {},
      updatedAt: Date.now(),
    };
    if (snapshot.exists()) {
      const roomData = snapshot.val() as OnlineRoom;
      if (roomData.players) {
        Object.keys(roomData.players).forEach((pid) => {
          updates[`players/${pid}/bets`] = {};
          updates[`players/${pid}/currentBetTotal`] = 0;
        });
      }
    }
    await update(roomRef, updates);
  } else {
    if (localMockRoom) {
      localMockRoom.status = 'betting';
      localMockRoom.roundNumber = nextRoundNumber;
      localMockRoom.totalBets = {};
      const mockPlayers = localMockRoom.players;
      if (mockPlayers) {
        Object.keys(mockPlayers).forEach((pid) => {
          if (mockPlayers[pid]) {
            mockPlayers[pid].bets = {};
            mockPlayers[pid].currentBetTotal = 0;
          }
        });
      }
      localMockRoom.updatedAt = Date.now();
      notifyMockSubscribers();
    }
  }
};
