export type SymbolId = 'tiger' | 'calabash' | 'rooster' | 'shrimp' | 'crab' | 'fish' | 'deer';

export interface SymbolDefinition {
  id: SymbolId;
  nameKhmer: string;
  nameEnglish: string;
  pronunciation: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
}

export type BetMap = Partial<Record<SymbolId, number>>;

export type DiceResult = [SymbolId, SymbolId, SymbolId];

export interface SymbolMatchResult {
  symbol: SymbolId;
  count: number;
  betAmount: number;
  winMultiplier: number;
  payoutAmount: number; // returned to wallet = bet + (bet * count)
  netProfit: number;   // profit = bet * count
}

export interface RoundResult {
  roundId: number;
  timestamp: number;
  dice: DiceResult;
  bets: BetMap;
  totalBet: number;
  totalPayout: number;
  netProfit: number;
  matches: SymbolMatchResult[];
  isWin: boolean;
}

export type GamePhase = 'betting' | 'shaking' | 'revealing' | 'result';

export interface PlayerStats {
  totalRounds: number;
  roundsWon: number;
  roundsLost: number;
  totalBetAmount: number;
  totalWonAmount: number;
  maxWinSingleRound: number;
  currentStreak: number;
  bestStreak: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  language: 'km' | 'en';
  symbolVariant: 'calabash' | 'deer'; // Calabash (ឃ្លោក) vs Deer (ក្តាន់)
  minBet: number;
  maxBet: number;
}
