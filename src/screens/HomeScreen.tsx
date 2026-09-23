import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FestiveBunting } from '../components/FestiveBunting';
import { GoldHeader } from '../components/GoldHeader';
import { useGameStore } from '../store/gameStore';
import { formatCoins } from '../services/gameLogic';
import { COLORS, FONTS } from '../constants/theme';
import { TigerIcon, CalabashIcon, FishIcon } from '../components/AnimalIcons';

interface Props {
  onStartGame: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onStartGame,
  onOpenHistory,
  onOpenSettings,
  onOpenRules,
}) => {
  const { balance, stats, claimFreeCoins } = useGameStore();

  const winRate =
    stats.totalRounds > 0
      ? Math.round((stats.roundsWon / stats.totalRounds) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <FestiveBunting />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top Title Plaque */}
          <View style={styles.headerSpacing}>
            <GoldHeader
              titleKhmer="ខ្លាឃ្លោក ភូមិយើង"
              subtitle="TRADITIONAL KHMER CASINO"
            />
          </View>

          {/* Hero Emblem Banner with Animal Trio */}
          <View style={styles.heroSection}>
            <View style={styles.heroEmblemTrio}>
              <View style={[styles.emblemWrapper, styles.emblemLeft]}>
                <TigerIcon size={56} />
              </View>
              <View style={[styles.emblemWrapper, styles.emblemCenter]}>
                <CalabashIcon size={72} />
              </View>
              <View style={[styles.emblemWrapper, styles.emblemRight]}>
                <FishIcon size={56} />
              </View>
            </View>

            <Text style={styles.gameSubtitle}>KLA KLOUK BY KIMSAN</Text>
            <Text style={styles.gameDescription}>
              Traditional 3-Dice Cambodian Game with Authentic Sounds & Fair Odds
            </Text>
          </View>

          {/* Wallet Balance Display Card */}
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>កាបូបលុយរបស់អ្នក (YOUR WALLET)</Text>
            <View style={styles.balanceRow}>
              <Svg width={30} height={30} viewBox="0 0 100 100">
                <Defs>
                  <LinearGradient id="homeGoldCoin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFF176" />
                    <Stop offset="50%" stopColor="#F5BA13" />
                    <Stop offset="100%" stopColor="#D97706" />
                  </LinearGradient>
                </Defs>
                <Circle cx="50" cy="50" r="47" fill="url(#homeGoldCoin)" stroke="#B45309" strokeWidth="4" />
                <Circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />
                <Circle cx="50" cy="50" r="22" fill="#B45309" />
              </Svg>
              <Text style={styles.balanceText}>{formatCoins(balance)}</Text>
              <Text style={styles.coinsSuffix}>COINS</Text>
            </View>

            {/* Quick Free Bonus Refill */}
            <TouchableOpacity
              style={styles.claimBonusBtn}
              activeOpacity={0.8}
              onPress={claimFreeCoins}
            >
              <Text style={styles.claimBonusText}>+3,000 FREE COINS</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Player Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.totalRounds}</Text>
              <Text style={styles.statLbl}>ROUNDS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#10B981' }]}>{winRate}%</Text>
              <Text style={styles.statLbl}>WIN RATE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FFE082' }]}>
                {stats.bestStreak}
              </Text>
              <Text style={styles.statLbl}>STREAK</Text>
            </View>
          </View>

          {/* Main Action Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Play Button */}
            <TouchableOpacity
              style={styles.playButton}
              activeOpacity={0.8}
              onPress={onStartGame}
            >
              <Text style={styles.playKhmer}>ចូលលេងហ្គេម</Text>
              <Text style={styles.playEng}>START GAME</Text>
            </TouchableOpacity>

            {/* Secondary Buttons Row */}
            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.navBtn}
                activeOpacity={0.8}
                onPress={onOpenHistory}
              >
                <Text style={styles.navIcon}>📜</Text>
                <Text style={styles.navTitle}>ប្រវត្តិលេង</Text>
                <Text style={styles.navSub}>HISTORY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                activeOpacity={0.8}
                onPress={onOpenRules}
              >
                <Text style={styles.navIcon}>📖</Text>
                <Text style={styles.navTitle}>របៀបលេង</Text>
                <Text style={styles.navSub}>RULES</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navBtn}
                activeOpacity={0.8}
                onPress={onOpenSettings}
              >
                <Text style={styles.navIcon}>⚙️</Text>
                <Text style={styles.navTitle}>ការកំណត់</Text>
                <Text style={styles.navSub}>SETTINGS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Developer Credit */}
          <View style={styles.devCreditWrapper}>
            <Text style={styles.devCreditKhmer}>បង្កើតឡើងដោយ ៖ លី គីមសាន</Text>
            <Text style={styles.devCreditEng}>Developed by Ly Kimsan</Text>
          </View>
        </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1218',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 16, 24, 0.42)',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerSpacing: {
    marginTop: 18,
    marginBottom: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  heroEmblemTrio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emblemWrapper: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F5BA13',
    backgroundColor: '#1E293B',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  emblemLeft: {
    marginRight: -10,
    zIndex: 1,
  },
  emblemCenter: {
    zIndex: 3,
    transform: [{ scale: 1.1 }],
    borderColor: '#FFD700',
  },
  emblemRight: {
    marginLeft: -10,
    zIndex: 2,
  },
  gameSubtitle: {
    color: '#FFE082',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  gameDescription: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  walletCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#131F2A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F5BA13',
    padding: 14,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  walletLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  balanceText: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  coinsSuffix: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
  },
  claimBonusBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  claimBonusText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 360,
    marginVertical: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.3)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  statNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  statLbl: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 360,
    marginTop: 12,
    gap: 12,
  },
  playButton: {
    width: '100%',
    backgroundColor: '#F5BA13',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFE082',
    shadowColor: '#F5BA13',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  playKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#451A03',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  playEng: {
    color: '#78350F',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
  },
  navSub: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  devCreditWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 186, 19, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(245, 186, 19, 0.3)',
  },
  devCreditKhmer: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  devCreditEng: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
