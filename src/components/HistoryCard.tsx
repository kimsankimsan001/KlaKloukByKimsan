import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoundResult, SymbolId } from '../types';
import { SymbolIconRenderer } from './AnimalIcons';
import { ALL_SYMBOLS } from '../constants/symbols';
import { COLORS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';

interface Props {
  round: RoundResult;
}

export const HistoryCard: React.FC<Props> = ({ round }) => {
  const isWin = round.isWin;
  const dateStr = new Date(round.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <View style={[styles.card, isWin ? styles.winBorder : styles.loseBorder]}>
      {/* Top Row: Round ID, Time & Outcome Badge */}
      <View style={styles.topRow}>
        <View style={styles.roundInfo}>
          <Text style={styles.roundId}>ROUND #{round.roundId}</Text>
          <Text style={styles.timestamp}>{dateStr}</Text>
        </View>

        <View style={[styles.outcomeBadge, isWin ? styles.badgeWin : styles.badgeLose]}>
          <Text style={styles.outcomeText}>
            {isWin ? `+${formatCoins(round.netProfit)}` : `-${formatCoins(round.totalBet)}`}
          </Text>
        </View>
      </View>

      {/* Middle Row: The 3 Dice Outcome */}
      <View style={styles.diceRow}>
        {round.dice.map((sym, idx) => (
          <View key={`hist-dice-${idx}`} style={styles.diceItem}>
            <SymbolIconRenderer symbolId={sym} size={32} />
            <Text style={styles.diceName}>{ALL_SYMBOLS[sym]?.nameKhmer}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Row: Bets Placed Summary */}
      <View style={styles.betsRow}>
        <Text style={styles.betsLabel}>Bets:</Text>
        <View style={styles.betsList}>
          {Object.entries(round.bets).map(([sym, amt]) => {
            if (!amt) return null;
            return (
              <View key={sym} style={styles.betChip}>
                <Text style={styles.betChipText}>
                  {ALL_SYMBOLS[sym as SymbolId]?.nameKhmer}: ${formatCoins(amt)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  winBorder: {
    borderColor: 'rgba(16, 185, 129, 0.6)',
  },
  loseBorder: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundId: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestamp: {
    color: '#94A3B8',
    fontSize: 10,
  },
  outcomeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeWin: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  badgeLose: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  outcomeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  diceRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  diceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  diceName: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  betsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  betsLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  betsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  betChip: {
    backgroundColor: 'rgba(245, 186, 19, 0.12)',
    borderColor: 'rgba(245, 186, 19, 0.4)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  betChipText: {
    color: '#FFE082',
    fontSize: 9.5,
    fontWeight: '700',
  },
});
