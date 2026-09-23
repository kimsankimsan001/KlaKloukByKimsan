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
  status: 'betting' | 'rolling' | 'payout';
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

export const createOnlineRoom = async (player: {
  id: string;
  name: string;
  avatar: string;
  balance: number;
}): Promise<string> => {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  const db = getFirebaseDb();

  const hostPlayer: OnlinePlayer = {
    id: player.id,
    name: player.name || 'Ly Kimsan',
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
    balance: number;
  }
): Promise<{ success: boolean; error?: string }> => {
  const db = getFirebaseDb();

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return { success: false, error: 'បន្ទប់ល្បែងមិនត្រឹមត្រូវ ឬបានបិទ (Room not found)' };
    }

    const roomData = snapshot.val() as OnlineRoom;
    const isHost = roomData.hostId === player.id;

    const joiningPlayer: OnlinePlayer = {
      id: player.id,
      name: player.name || `Player ${player.id.slice(0, 4)}`,
      avatar: player.avatar || '🎲',
      balance: player.balance,
      isHost,
      lastActive: Date.now(),
      currentBetTotal: 0,
      bets: {},
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
            name: player.name || 'You',
            avatar: player.avatar || '🎲',
            balance: player.balance,
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
      localMockRoom.players[player.id] = {
        id: player.id,
        name: player.name || 'You',
        avatar: player.avatar || '🎲',
        balance: player.balance,
        isHost: localMockRoom.hostId === player.id,
        lastActive: Date.now(),
        currentBetTotal: 0,
        bets: {},
      };
    }
    notifyMockSubscribers();
    return { success: true };
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
        // Firebase objects might have undefined players if all left
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
  bets: Record<string, number>
): Promise<void> => {
  const totalAmount = Object.values(bets).reduce((a, b) => a + b, 0);
  const db = getFirebaseDb();

  if (db && isFirebaseConfigured()) {
    const playerBetsRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    await update(playerBetsRef, {
      bets,
      currentBetTotal: totalAmount,
      lastActive: Date.now(),
    });
  } else {
    if (localMockRoom && localMockRoom.players[playerId]) {
      localMockRoom.players[playerId].bets = bets;
      localMockRoom.players[playerId].currentBetTotal = totalAmount;
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

  if (db && isFirebaseConfigured()) {
    const roomRef = ref(db, `rooms/${roomId}`);
    await update(roomRef, {
      status: 'rolling',
      diceResult,
      updatedAt: Date.now(),
    });
  } else {
    if (localMockRoom) {
      localMockRoom.status = 'rolling';
      localMockRoom.diceResult = diceResult;
      localMockRoom.updatedAt = Date.now();
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
    await update(roomRef, {
      status: 'betting',
      roundNumber: nextRoundNumber,
      updatedAt: Date.now(),
    });
  } else {
    if (localMockRoom) {
      localMockRoom.status = 'betting';
      localMockRoom.roundNumber = nextRoundNumber;
      localMockRoom.updatedAt = Date.now();
      notifyMockSubscribers();
    }
  }
};
