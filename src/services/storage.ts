import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, PlayerStats, RoundResult } from '../types';

const STORAGE_KEYS = {
  WALLET: '@kla_klouk_wallet_v1',
  HISTORY: '@kla_klouk_history_v1',
  STATS: '@kla_klouk_stats_v1',
  SETTINGS: '@kla_klouk_settings_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  language: 'km',
  symbolVariant: 'calabash',
  minBet: 10,
  maxBet: 50000,
};

const DEFAULT_STATS: PlayerStats = {
  totalRounds: 0,
  roundsWon: 0,
  roundsLost: 0,
  totalBetAmount: 0,
  totalWonAmount: 0,
  maxWinSingleRound: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export const DEFAULT_STARTING_BALANCE = 10000;

export const StorageService = {
  async getWallet(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WALLET);
      if (data !== null) {
        const val = parseInt(data, 10);
        if (!isNaN(val)) return val;
      }
      return DEFAULT_STARTING_BALANCE;
    } catch {
      return DEFAULT_STARTING_BALANCE;
    }
  },

  async saveWallet(balance: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WALLET, balance.toString());
    } catch (e) {
      console.warn('Failed to save wallet balance', e);
    }
  },

  async getHistory(): Promise<RoundResult[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data) as RoundResult[];
      }
      return [];
    } catch {
      return [];
    }
  },

  async saveHistory(history: RoundResult[]): Promise<void> {
    try {
      // Keep most recent 50 rounds
      const trimmed = history.slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save game history', e);
    }
  },

  async getStats(): Promise<PlayerStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
      return DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  async saveStats(stats: PlayerStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats', e);
    }
  },

  async getSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  },

  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WALLET,
        STORAGE_KEYS.HISTORY,
        STORAGE_KEYS.STATS,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (e) {
      console.warn('Failed to reset storage', e);
    }
  },
};
