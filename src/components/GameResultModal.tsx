import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RoundResult } from '../types';
import { SymbolIconRenderer } from './AnimalIcons';
import { ALL_SYMBOLS } from '../constants/symbols';
import { COLORS, FONTS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';

interface Props {
  visible: boolean;
  result: RoundResult | null;
  onClose: () => void;
}

export const GameResultModal: React.FC<Props> = ({
  visible,
  result,
  onClose,
}) => {
  if (!result) return null;

  const isWin = result.isWin;
  const winningMatches = result.matches.filter((m) => m.count > 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, isWin ? styles.winCard : styles.loseCard]}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, isWin ? styles.headerWin : styles.headerLose]}>
            <Text style={styles.headerKhmer}>
              {isWin ? 'អ្នកឈ្នះហើយ!' : 'សូមព្យាយាមម្តងទៀត'}
            </Text>
            <Text style={styles.headerEnglish}>
              {isWin ? 'CONGRATULATIONS! YOU WON!' : 'ROUND FINISHED'}
            </Text>
          </View>

          {/* Dice Result Display */}
          <View style={styles.diceResultSection}>
            <Text style={styles.sectionTitle}>លទ្ធផលគ្រាប់ឡុកឡាក់ (DICE OUTCOME)</Text>
            <View style={styles.diceRow}>
              {result.dice.map((symbol, idx) => (
                <View key={`res-dice-${idx}`} style={styles.diceBadge}>
                  <SymbolIconRenderer symbolId={symbol} size={42} />
                  <Text style={styles.diceKhmerLabel}>
                    {ALL_SYMBOLS[symbol]?.nameKhmer || symbol}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Profit / Payout Banner */}
          <View style={styles.payoutBox}>
            <Text style={styles.payoutLabel}>
              {isWin ? 'ប្រាក់រង្វាន់សរុប (NET WIN)' : 'ប្រាក់ភ្នាល់ (TOTAL BET)'}
            </Text>
            <Text style={[styles.payoutAmount, isWin ? styles.winAmount : styles.loseAmount]}>
              {isWin ? `+${formatCoins(result.netProfit)}` : `-${formatCoins(result.totalBet)}`} COINS
            </Text>
          </View>

          {/* Matches Breakdown */}
          {winningMatches.length > 0 && (
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>ការភ្នាល់ត្រូវ (MATCHED BETS):</Text>
              {winningMatches.map((m, idx) => (
                <View key={`match-${idx}`} style={styles.matchRow}>
                  <Text style={styles.matchSymbol}>
                    {ALL_SYMBOLS[m.symbol]?.nameKhmer} ({ALL_SYMBOLS[m.symbol]?.nameEnglish})
                  </Text>
                  <Text style={styles.matchCount}>x{m.count} ({m.count}x Win)</Text>
                  <Text style={styles.matchWin}>+{formatCoins(m.netProfit)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Continue / Play Again Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.continueKhmer}>លេងបន្ត</Text>
            <Text style={styles.continueEng}>PLAY NEXT ROUND</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 999,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#F5BA13',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    alignItems: 'center',
    paddingBottom: 16,
  },
  winCard: {
    borderColor: '#FFD700',
    shadowColor: '#F5BA13',
  },
  loseCard: {
    borderColor: '#64748B',
  },
  headerBanner: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerWin: {
    backgroundColor: '#92400E',
  },
  headerLose: {
    backgroundColor: '#334155',
  },
  headerKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerEnglish: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  diceResultSection: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  diceRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  diceBadge: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    padding: 6,
    alignItems: 'center',
    width: 66,
  },
  diceKhmerLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  payoutBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.4)',
  },
  payoutLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  winAmount: {
    color: '#10B981',
  },
  loseAmount: {
    color: '#EF4444',
  },
  breakdownSection: {
    width: '90%',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
    gap: 4,
  },
  breakdownTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchSymbol: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  matchCount: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '700',
  },
  matchWin: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  continueBtn: {
    width: '85%',
    backgroundColor: '#F5BA13',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#F5BA13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  continueKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#451A03',
    fontSize: 17,
    fontWeight: '900',
  },
  continueEng: {
    color: '#78350F',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
