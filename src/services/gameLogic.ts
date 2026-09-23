import { BetMap, DiceResult, RoundResult, SymbolId, SymbolMatchResult } from '../types';
import { getActiveSymbols } from '../constants/symbols';

/**
 * Generates a cryptographically fair random symbol for one dice.
 */
export function rollSingleDice(variant: 'calabash' | 'deer' = 'calabash'): SymbolId {
  const activeSymbols = getActiveSymbols(variant);
  let randomIndex = 0;

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomIndex = array[0] % activeSymbols.length;
  } else {
    randomIndex = Math.floor(Math.random() * activeSymbols.length);
  }

  return activeSymbols[randomIndex].id;
}

/**
 * Rolls three dice independently with fair 16.66% probability per symbol.
 */
export function rollThreeDice(variant: 'calabash' | 'deer' = 'calabash'): DiceResult {
  return [
    rollSingleDice(variant),
    rollSingleDice(variant),
    rollSingleDice(variant),
  ];
}

/**
 * Calculates results and payouts for a round according to traditional Kla Klouk rules:
 * - 0 matches: bet is lost
 * - 1 match: win 1x bet (payout = bet * 2)
 * - 2 matches: win 2x bet (payout = bet * 3)
 * - 3 matches: win 3x bet (payout = bet * 4)
 */
export function calculateRoundResult(
  roundId: number,
  bets: BetMap,
  dice: DiceResult
): RoundResult {
  // Count frequency of each symbol in the roll
  const symbolCounts: Partial<Record<SymbolId, number>> = {};
  for (const sym of dice) {
    symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
  }

  let totalBet = 0;
  let totalPayout = 0;
  const matches: SymbolMatchResult[] = [];

  for (const [symbolKey, betAmount] of Object.entries(bets)) {
    if (!betAmount || betAmount <= 0) continue;
    const symbol = symbolKey as SymbolId;
    totalBet += betAmount;

    const count = symbolCounts[symbol] || 0;
    if (count > 0) {
      const netWin = betAmount * count;
      const payout = betAmount + netWin; // Bet returned + win multiplier
      totalPayout += payout;

      matches.push({
        symbol,
        count,
        betAmount,
        winMultiplier: count,
        payoutAmount: payout,
        netProfit: netWin,
      });
    } else {
      matches.push({
        symbol,
        count: 0,
        betAmount,
        winMultiplier: 0,
        payoutAmount: 0,
        netProfit: -betAmount,
      });
    }
  }

  const netProfit = totalPayout - totalBet;
  const isWin = netProfit > 0;

  return {
    roundId,
    timestamp: Date.now(),
    dice,
    bets: { ...bets },
    totalBet,
    totalPayout,
    netProfit,
    matches,
    isWin,
  };
}

/**
 * Formats currency amounts with commas (e.g. 10,000)
 */
export function formatCoins(amount: number): string {
  return amount.toLocaleString('en-US');
}
