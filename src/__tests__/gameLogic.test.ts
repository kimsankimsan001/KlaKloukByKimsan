import { describe, test, expect } from '@jest/globals';
import { rollSingleDice, rollThreeDice, calculateRoundResult } from '../services/gameLogic';
import { BetMap, DiceResult } from '../types';

describe('Kla Klouk Game Logic', () => {
  test('rollSingleDice returns valid symbol from active set', () => {
    const validSymbols = ['tiger', 'calabash', 'rooster', 'shrimp', 'crab', 'fish'];
    for (let i = 0; i < 50; i++) {
      const sym = rollSingleDice('calabash');
      expect(validSymbols).toContain(sym);
    }
  });

  test('rollSingleDice with deer variant returns valid symbol', () => {
    const validSymbols = ['tiger', 'deer', 'rooster', 'shrimp', 'crab', 'fish'];
    for (let i = 0; i < 50; i++) {
      const sym = rollSingleDice('deer');
      expect(validSymbols).toContain(sym);
    }
  });

  test('rollThreeDice returns exactly 3 symbols', () => {
    const dice = rollThreeDice();
    expect(dice).toHaveLength(3);
  });

  test('fair distribution: 6000 rolls should distribute roughly evenly (~1000 each ±150)', () => {
    const counts: Record<string, number> = {};
    const totalRolls = 6000;
    for (let i = 0; i < totalRolls; i++) {
      const sym = rollSingleDice();
      counts[sym] = (counts[sym] || 0) + 1;
    }

    const expectedCount = totalRolls / 6;
    for (const [sym, count] of Object.entries(counts)) {
      // 1000 expected, ±150 is > 99.9% confidence interval
      expect(count).toBeGreaterThan(expectedCount - 150);
      expect(count).toBeLessThan(expectedCount + 150);
    }
  });

  describe('calculateRoundResult Payout Rules', () => {
    test('Scenario 1: No match loses entire bet', () => {
      const bets: BetMap = { tiger: 100 };
      const dice: DiceResult = ['crab', 'fish', 'shrimp'];
      const result = calculateRoundResult(1, bets, dice);

      expect(result.totalBet).toBe(100);
      expect(result.totalPayout).toBe(0);
      expect(result.netProfit).toBe(-100);
      expect(result.isWin).toBe(false);
    });

    test('Scenario 2: Single match wins 1x bet amount', () => {
      const bets: BetMap = { tiger: 100 };
      const dice: DiceResult = ['tiger', 'fish', 'shrimp'];
      const result = calculateRoundResult(1, bets, dice);

      expect(result.totalBet).toBe(100);
      expect(result.totalPayout).toBe(200); // 100 bet returned + 100 win
      expect(result.netProfit).toBe(100);
      expect(result.isWin).toBe(true);
    });

    test('Scenario 3: Double match wins 2x bet amount (Prompt example)', () => {
      const bets: BetMap = { rooster: 100, fish: 50 };
      const dice: DiceResult = ['rooster', 'rooster', 'crab'];
      const result = calculateRoundResult(1, bets, dice);

      expect(result.totalBet).toBe(150);
      // Rooster wins 2x (100 * 2 = 200 win + 100 original = 300)
      // Fish loses 50
      expect(result.totalPayout).toBe(300);
      expect(result.netProfit).toBe(150);
      expect(result.isWin).toBe(true);

      const roosterMatch = result.matches.find(m => m.symbol === 'rooster');
      expect(roosterMatch?.count).toBe(2);
      expect(roosterMatch?.netProfit).toBe(200);

      const fishMatch = result.matches.find(m => m.symbol === 'fish');
      expect(fishMatch?.count).toBe(0);
      expect(fishMatch?.netProfit).toBe(-50);
    });

    test('Scenario 4: Triple match wins 3x bet amount', () => {
      const bets: BetMap = { crab: 200 };
      const dice: DiceResult = ['crab', 'crab', 'crab'];
      const result = calculateRoundResult(1, bets, dice);

      expect(result.totalBet).toBe(200);
      expect(result.totalPayout).toBe(800); // 200 bet + 600 win (3x)
      expect(result.netProfit).toBe(600);
      expect(result.isWin).toBe(true);
    });
  });
});
