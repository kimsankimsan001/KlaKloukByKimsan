import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RoundResult, SymbolId } from '../types';
import { OnlinePlayer } from '../services/multiplayerService';
import { SymbolIconRenderer } from './AnimalIcons';
import { ALL_SYMBOLS } from '../constants/symbols';
import { COLORS, FONTS } from '../constants/theme';
import { formatCoins, calculateRoundResult } from '../services/gameLogic';

interface Props {
  visible: boolean;
  result: RoundResult | null;
  onClose: () => void;
  onNavigateHome?: () => void;
  isHost?: boolean;
  isOnline?: boolean;
  onlinePlayers?: OnlinePlayer[];
}

export const GameResultModal: React.FC<Props> = ({
  visible,
  result,
  onClose,
  onNavigateHome,
  isHost = false,
  isOnline = false,
  onlinePlayers = [],
}) => {
  if (!result) return null;

  // 1. DEALER (HOST) SUMMARY VIEW
  if (isOnline && isHost) {
    const guests = onlinePlayers.filter((p) => !p.isHost);

    // Compute outcomes for each guest participant
    const guestSettlements = guests.map((p) => {
      const pBets = p.bets || {};
      const pRes = calculateRoundResult(result.roundId, pBets, result.dice);
      const guestNet = pRes.netProfit;
      const hostNetFromGuest = -guestNet;
      return {
        player: p,
        bets: pBets,
        res: pRes,
        guestNet,
        hostNetFromGuest,
      };
    });

    const totalGuestBets = guests.reduce((sum, p) => sum + (p.currentBetTotal || 0), 0);
    const totalHostNet = guestSettlements.reduce((sum, g) => sum + g.hostNetFromGuest, 0);
    const isHostProfit = totalHostNet > 0;
    const isHostLoss = totalHostNet < 0;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.card,
              isHostProfit ? styles.winCard : isHostLoss ? styles.loseCard : styles.neutralCard,
            ]}
          >
            {/* Dealer Header Banner */}
            <View
              style={[
                styles.headerBanner,
                isHostProfit ? styles.headerWin : isHostLoss ? styles.headerLose : styles.headerNeutral,
              ]}
            >
              <Text style={styles.headerKhmer}>
                {isHostProfit
                  ? 'មេស៊ីចំណេញ! 🎉'
                  : isHostLoss
                  ? 'មេត្រូវសងកូន! 💸'
                  : 'លទ្ធផលជុំមេ (ស្មើ) ⚖️'}
              </Text>
              <Text style={styles.headerEnglish}>
                DEALER SETTLEMENT • ROUND #{result.roundId}
              </Text>
            </View>

            {/* Rolled Dice Section */}
            <View style={styles.diceResultSection}>
              <Text style={styles.sectionTitle}>លទ្ធផលគ្រាប់ឡុកឡាក់ (DICE OUTCOME)</Text>
              <View style={styles.diceRow}>
                {result.dice.map((symbol, idx) => (
                  <View key={`res-dice-${idx}`} style={styles.diceBadge}>
                    <SymbolIconRenderer symbolId={symbol} size={40} />
                    <Text style={styles.diceKhmerLabel}>
                      {ALL_SYMBOLS[symbol]?.nameKhmer || symbol}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Host Net Profit / Loss Banner */}
            <View style={styles.payoutBox}>
              <Text style={styles.payoutLabel}>ផលចំណេញសុទ្ធរបស់មេ (HOUSE NET PROFIT)</Text>
              <Text
                style={[
                  styles.payoutAmount,
                  isHostProfit ? styles.winAmount : isHostLoss ? styles.loseAmount : styles.neutralAmount,
                ]}
              >
                {isHostProfit
                  ? `+$${formatCoins(totalHostNet)}`
                  : isHostLoss
                  ? `-$${formatCoins(Math.abs(totalHostNet))}`
                  : `$0`}
              </Text>
              <Text style={styles.subBetStats}>
                ប្រាក់កូនចាក់សរុប៖ ${formatCoins(totalGuestBets)}
              </Text>
            </View>

            {/* Guest Players Breakdown */}
            <View style={styles.dealerSection}>
              <Text style={styles.dealerSectionTitle}>
                👥 លទ្ធផលកូនទាំងអស់ ({guests.length} នាក់)
              </Text>

              <ScrollView
                style={styles.guestListScroll}
                contentContainerStyle={styles.guestListContent}
                showsVerticalScrollIndicator={false}
              >
                {guests.length === 0 ? (
                  <View style={styles.emptyGuestBox}>
                    <Text style={styles.emptyGuestText}>មិនទាន់មានកូនចូលរួមក្នុងតុនៅឡើយទេ</Text>
                  </View>
                ) : (
                  guestSettlements.map((g) => {
                    const hasBets = Object.keys(g.bets).length > 0 && g.res.totalBet > 0;
                    const guestWon = g.guestNet > 0;
                    const guestLost = g.guestNet < 0;

                    return (
                      <View key={g.player.id} style={styles.guestCard}>
                        {/* Guest Row Header */}
                        <View style={styles.guestHeaderRow}>
                          <View style={styles.guestInfo}>
                            <Text style={styles.guestAvatar}>{g.player.avatar || '🎲'}</Text>
                            <View>
                              <Text style={styles.guestName} numberOfLines={1}>
                                {g.player.name}
                              </Text>
                              <Text style={styles.guestRoleLabel}>កូនចាក់</Text>
                            </View>
                          </View>

                          {/* Win/Loss Status Badge */}
                          <View
                            style={[
                              styles.statusBadge,
                              !hasBets
                                ? styles.statusBadgeNone
                                : guestWon
                                ? styles.statusBadgeWin
                                : guestLost
                                ? styles.statusBadgeLose
                                : styles.statusBadgeTie,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeTxt,
                                !hasBets
                                  ? styles.statusBadgeTxtNone
                                  : guestWon
                                  ? styles.statusBadgeTxtWin
                                  : guestLost
                                  ? styles.statusBadgeTxtLose
                                  : styles.statusBadgeTxtTie,
                              ]}
                            >
                              {!hasBets
                                ? 'មិនបានចាក់'
                                : guestWon
                                ? `ឈ្នះ +$${formatCoins(g.guestNet)}`
                                : guestLost
                                ? `ចាញ់ -$${formatCoins(Math.abs(g.guestNet))}`
                                : 'ស្មើ $0'}
                            </Text>
                          </View>
                        </View>

                        {/* Guest Bet Details */}
                        {hasBets ? (
                          <View style={styles.guestBetsWrap}>
                            {Object.entries(g.bets).map(([symId, amt]) => {
                              if (!amt || amt <= 0) return null;
                              const isHit = result.dice.includes(symId as SymbolId);
                              const matchCount = result.dice.filter((d) => d === symId).length;
                              return (
                                <View
                                  key={symId}
                                  style={[styles.betChipBadge, isHit && styles.betChipBadgeHit]}
                                >
                                  <Text
                                    style={[styles.betChipTxt, isHit && styles.betChipTxtHit]}
                                  >
                                    {ALL_SYMBOLS[symId as SymbolId]?.nameKhmer || symId}: $
                                    {formatCoins(amt)}
                                    {isHit ? ` (ត្រូវ x${matchCount})` : ''}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        ) : null}

                        {/* Host Impact Row */}
                        {hasBets && (
                          <View style={styles.hostImpactRow}>
                            <Text style={guestWon ? styles.hostImpactLose : styles.hostImpactWin}>
                              {guestWon
                                ? `↳ មេត្រូវសងកូននេះ៖ -$${formatCoins(g.guestNet)}`
                                : guestLost
                                ? `↳ មេស៊ីពីកូននេះ៖ +$${formatCoins(Math.abs(g.guestNet))}`
                                : '↳ មិនមានការទូទាត់ទេ'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>

            {/* Next Round Button */}
            <TouchableOpacity
              style={styles.continueBtn}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.continueKhmer}>លេងជុំបន្ទាប់</Text>
              <Text style={styles.continueEng}>START NEXT ROUND</Text>
            </TouchableOpacity>

            {/* Exit to Main Menu Button */}
            {onNavigateHome && (
              <TouchableOpacity
                style={styles.exitModalBtn}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onNavigateHome();
                }}
              >
                <Text style={styles.exitModalBtnTxt}>🏠 ចេញទៅ Main Menu</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  // 2. GUEST PLAYER / SINGLE PLAYER VIEW
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
              {isWin ? 'ប្រាក់រង្វាន់សុទ្ធ (NET WIN)' : 'ប្រាក់ភ្នាល់ (TOTAL BET)'}
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

          {/* Exit to Main Menu Button */}
          {onNavigateHome && (
            <TouchableOpacity
              style={styles.exitModalBtn}
              activeOpacity={0.8}
              onPress={() => {
                onClose();
                onNavigateHome();
              }}
            >
              <Text style={styles.exitModalBtnTxt}>🏠 ចេញទៅ Main Menu</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999,
  },
  card: {
    width: '95%',
    maxWidth: 420,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#F5BA13',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 14,
    alignItems: 'center',
    paddingBottom: 16,
  },
  winCard: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
  },
  loseCard: {
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  neutralCard: {
    borderColor: '#F5BA13',
    shadowColor: '#F5BA13',
  },
  headerBanner: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerWin: {
    backgroundColor: '#065F46',
  },
  headerLose: {
    backgroundColor: '#991B1B',
  },
  headerNeutral: {
    backgroundColor: '#334155',
  },
  headerKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerEnglish: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  diceResultSection: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
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
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.4)',
    width: '90%',
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
  neutralAmount: {
    color: '#94A3B8',
  },
  subBetStats: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  dealerSection: {
    width: '92%',
    marginTop: 6,
    marginBottom: 8,
  },
  dealerSectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11.5,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  guestListScroll: {
    maxHeight: 180,
    width: '100%',
  },
  guestListContent: {
    gap: 6,
    paddingBottom: 4,
  },
  emptyGuestBox: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 8,
  },
  emptyGuestText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: FONTS.khmerRegular,
  },
  guestCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  guestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  guestAvatar: {
    fontSize: 18,
  },
  guestName: {
    fontFamily: FONTS.khmerBold,
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  guestRoleLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeWin: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  statusBadgeLose: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  statusBadgeTie: {
    backgroundColor: 'rgba(245, 186, 19, 0.15)',
    borderColor: '#F5BA13',
  },
  statusBadgeNone: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    borderColor: '#64748B',
  },
  statusBadgeTxt: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: FONTS.khmerBold,
  },
  statusBadgeTxtWin: {
    color: '#10B981',
  },
  statusBadgeTxtLose: {
    color: '#EF4444',
  },
  statusBadgeTxtTie: {
    color: '#F5BA13',
  },
  statusBadgeTxtNone: {
    color: '#94A3B8',
  },
  guestBetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  betChipBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  betChipBadgeHit: {
    backgroundColor: 'rgba(245, 186, 19, 0.15)',
    borderColor: '#F5BA13',
  },
  betChipTxt: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  betChipTxtHit: {
    color: '#FCD34D',
    fontWeight: '800',
  },
  hostImpactRow: {
    marginTop: 4,
    paddingTop: 3,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  hostImpactWin: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.khmerBold,
  },
  hostImpactLose: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.khmerBold,
  },
  breakdownSection: {
    width: '90%',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
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
    width: '90%',
    backgroundColor: '#F5BA13',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#F5BA13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  continueKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#451A03',
    fontSize: 16,
    fontWeight: '900',
  },
  continueEng: {
    color: '#78350F',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  exitModalBtn: {
    width: '90%',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  exitModalBtnTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
