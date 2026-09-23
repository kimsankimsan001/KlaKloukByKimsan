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
  onStartSinglePlayer: () => void;
  onStartCreateTable: () => void;
  onStartJoinTable: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenHistory?: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onStartSinglePlayer,
  onStartCreateTable,
  onStartJoinTable,
  onOpenSettings,
  onOpenAbout,
  onOpenHistory,
}) => {
  const { balance, stats } = useGameStore();

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

          {/* 4 Main Menu Action Cards */}
          <View style={styles.menuCardsContainer}>
            {/* 1. Single Player */}
            <TouchableOpacity
              style={[styles.menuCard, styles.singlePlayerCard]}
              activeOpacity={0.8}
              onPress={onStartSinglePlayer}
            >
              <View style={styles.menuIconCircle}>
                <Text style={styles.menuIconText}>🎲</Text>
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitleKhmer}>លេងម្នាក់ឯង</Text>
                <Text style={styles.menuTitleEng}>SINGLE PLAYER (OFFLINE)</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            {/* 2. Create Table (Host) */}
            <TouchableOpacity
              style={[styles.menuCard, styles.createTableCard]}
              activeOpacity={0.8}
              onPress={onStartCreateTable}
            >
              <View style={[styles.menuIconCircle, styles.createTableIconCircle]}>
                <Text style={styles.menuIconText}>👑</Text>
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.liveTagRow}>
                  <Text style={styles.createMenuTitleKhmer}>បង្កើតតុអនឡាញ</Text>
                  <View style={styles.hostTag}>
                    <Text style={styles.hostTagTxt}>HOST 👑</Text>
                  </View>
                </View>
                <Text style={styles.createMenuTitleEng}>CREATE TABLE (SET PIN & DEAL)</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            {/* 3. Join Table (Guest) */}
            <TouchableOpacity
              style={[styles.menuCard, styles.joinTableCard]}
              activeOpacity={0.8}
              onPress={onStartJoinTable}
            >
              <View style={[styles.menuIconCircle, styles.joinTableIconCircle]}>
                <Text style={styles.menuIconText}>🚪</Text>
              </View>
              <View style={styles.menuTextCol}>
                <View style={styles.liveTagRow}>
                  <Text style={styles.joinMenuTitleKhmer}>ចូលរួមតុ</Text>
                  <View style={styles.joinTag}>
                    <Text style={styles.joinTagTxt}>JOIN 🎲</Text>
                  </View>
                </View>
                <Text style={styles.joinMenuTitleEng}>ENTER 6-DIGIT ROOM ID & PIN</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            {/* 3 & 4: Setting and About in a 2-column Grid */}
            <View style={styles.secondaryMenuRow}>
              {/* Setting */}
              <TouchableOpacity
                style={[styles.menuSmallCard, styles.settingCard]}
                activeOpacity={0.8}
                onPress={onOpenSettings}
              >
                <Text style={styles.smallCardIcon}>⚙️</Text>
                <Text style={styles.smallCardTitle}>ការកំណត់</Text>
                <Text style={styles.smallCardSub}>SETTING</Text>
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity
                style={[styles.menuSmallCard, styles.aboutCard]}
                activeOpacity={0.8}
                onPress={onOpenAbout}
              >
                <Text style={styles.smallCardIcon}>📖</Text>
                <Text style={styles.smallCardTitle}>អំពីហ្គេម</Text>
                <Text style={styles.smallCardSub}>ABOUT & RULES</Text>
              </TouchableOpacity>
            </View>

            {/* History Link Button */}
            {onOpenHistory && (
              <TouchableOpacity
                style={styles.historyLinkBtn}
                activeOpacity={0.7}
                onPress={onOpenHistory}
              >
                <Text style={styles.historyLinkTxt}>📜 មើលប្រវត្តិលេងកន្លងមក (GAME HISTORY)</Text>
              </TouchableOpacity>
            )}
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
  menuCardsContainer: {
    width: '100%',
    maxWidth: 360,
    marginTop: 12,
    gap: 10,
  },
  menuCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  singlePlayerCard: {
    backgroundColor: 'rgba(245, 186, 19, 0.95)',
    borderColor: '#FFE082',
    shadowColor: '#F5BA13',
  },
  createTableCard: {
    backgroundColor: '#0F766E',
    borderColor: '#2DD4BF',
    shadowColor: '#0D9488',
  },
  joinTableCard: {
    backgroundColor: '#1E3A8A',
    borderColor: '#60A5FA',
    shadowColor: '#2563EB',
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  createTableIconCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  joinTableIconCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  menuIconText: {
    fontSize: 22,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitleKhmer: {
    fontFamily: FONTS.khmerBlack,
    fontSize: 19,
    fontWeight: '900',
    color: '#1E293B',
    lineHeight: 24,
  },
  menuTitleEng: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
    color: '#451A03',
  },
  createMenuTitleKhmer: {
    fontFamily: FONTS.khmerBlack,
    fontSize: 19,
    fontWeight: '900',
    color: '#CCFBF1',
    lineHeight: 24,
  },
  createMenuTitleEng: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
    color: '#5EEAD4',
  },
  joinMenuTitleKhmer: {
    fontFamily: FONTS.khmerBlack,
    fontSize: 19,
    fontWeight: '900',
    color: '#DBEAFE',
    lineHeight: 24,
  },
  joinMenuTitleEng: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
    color: '#93C5FD',
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  hostTagTxt: {
    color: '#451A03',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  joinTag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  joinTagTxt: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  liveTagTxt: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  menuArrow: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 26,
    fontWeight: '800',
    marginLeft: 6,
  },
  secondaryMenuRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  menuSmallCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  settingCard: {
    borderColor: '#D4AF37',
  },
  aboutCard: {
    borderColor: '#818CF8',
  },
  smallCardIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  smallCardTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 13,
    fontWeight: '800',
  },
  smallCardSub: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  historyLinkBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 2,
  },
  historyLinkTxt: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
  devCreditWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
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
