import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { getActiveSymbols, ALL_SYMBOLS } from '../constants/symbols';
import { FestiveBunting } from '../components/FestiveBunting';
import { GoldHeader } from '../components/GoldHeader';
import { TablePanel } from '../components/TablePanel';
import { BetSymbol } from '../components/BetSymbol';
import { DiceShaker } from '../components/DiceShaker';
import { BetPanel } from '../components/BetPanel';
import { CoinDisplay } from '../components/CoinDisplay';
import { GameResultModal } from '../components/GameResultModal';
import { COLORS, FONTS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';
import { SymbolId } from '../types';

interface Props {
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
}

export const GameScreen: React.FC<Props> = ({
  onNavigateHome,
  onNavigateHistory,
  onNavigateSettings,
}) => {
  const { width } = useWindowDimensions();
  const [hostNotice, setHostNotice] = useState<string | null>(null);

  // Zustand Store
  const {
    balance,
    currentBets,
    previousBets,
    selectedChip,
    totalBetAmount,
    roundNumber,
    gamePhase,
    currentDice,
    revealedDiceCount,
    currentResult,
    showResultModal,
    settings,
    isOnline,
    isHost,
    playerId,
    onlinePlayers,
    selectChip,
    placeBet,
    removeBet,
    clearBets,
    doubleBets,
    rebet,
    startRoll,
    closeResultModal,
    updateSettings,
  } = useGameStore();

  const isWideScreen = width >= 768; // Tablet or Landscape
  const activeSymbols = useMemo(
    () => getActiveSymbols(settings.symbolVariant),
    [settings.symbolVariant]
  );

  // Compute room bets for each symbol across all participants
  const symbolRoomBets = useMemo(() => {
    const map: Record<
      string,
      {
        total: number;
        players: {
          id: string;
          name: string;
          avatar: string;
          amount: number;
          isMe: boolean;
        }[];
      }
    > = {};

    if (!isOnline) return map;

    onlinePlayers.forEach((p) => {
      if (!p.bets) return;
      Object.entries(p.bets).forEach(([symId, amt]) => {
        if (amt && amt > 0) {
          if (!map[symId]) {
            map[symId] = { total: 0, players: [] };
          }
          map[symId].total += amt;
          map[symId].players.push({
            id: p.id,
            name: p.name,
            avatar: p.avatar || '🎲',
            amount: amt,
            isMe: p.id === playerId,
          });
        }
      });
    });

    return map;
  }, [isOnline, onlinePlayers, playerId]);

  // Total bets placed across room
  const totalRoomBets = useMemo(() => {
    if (!isOnline) return 0;
    return onlinePlayers.reduce((acc, p) => acc + (p.currentBetTotal || 0), 0);
  }, [isOnline, onlinePlayers]);

  // Live casino feed of recent bets
  const recentBetsFeed = useMemo(() => {
    if (!isOnline) return [];
    const feed: { playerName: string; symbolId: string; amount: number }[] = [];
    onlinePlayers.forEach((p) => {
      if (!p.bets) return;
      Object.entries(p.bets).forEach(([symId, amt]) => {
        if (amt && amt > 0) {
          feed.push({
            playerName: p.name,
            symbolId: symId,
            amount: amt,
          });
        }
      });
    });
    return feed;
  }, [isOnline, onlinePlayers]);

  const handlePressSymbol = (symId: SymbolId) => {
    if (isOnline && isHost) {
      setHostNotice('👑 លោកអ្នកជាមេ (DEALER) — មិនអាចចាក់ភ្នាល់បានទេ!');
      setTimeout(() => setHostNotice(null), 2500);
      return;
    }
    placeBet(symId);
  };

  // Responsive card sizing
  const gridPadding = isWideScreen ? 200 : 20;
  const availableGridWidth = Math.min(width - gridPadding, 520);
  const cardWidth = Math.floor((availableGridWidth - 28) / 3);

  // Determine winning symbols from round result
  const winningSymbols: SymbolId[] = useMemo(() => {
    if (gamePhase !== 'result' && gamePhase !== 'revealing') return [];
    return currentDice.slice(0, revealedDiceCount);
  }, [gamePhase, currentDice, revealedDiceCount]);

  const canRebet = Object.keys(previousBets).length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Festive Cambodian Pennant Flags across top */}
          <FestiveBunting />

          {/* Top Header Bar */}
          <CoinDisplay
            balance={balance}
            roundNumber={roundNumber}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            onOpenHistory={onNavigateHistory}
            onOpenSettings={onNavigateSettings}
            onNavigateHome={onNavigateHome}
          />

          {/* Ornate Khmer Title Plaque matching reference */}
          <GoldHeader
            titleKhmer="ខ្លាឃ្លោក ភូមិយើង"
            subtitle={settings.language === 'en' ? 'Khmer Kla Klouk Casino' : undefined}
          />

          {/* Host Dealer Notice Toast */}
          {hostNotice && (
            <View style={styles.hostToastBox}>
              <Text style={styles.hostToastTxt}>{hostNotice}</Text>
            </View>
          )}

          {/* Main Gaming Arena */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.boardLayout, isWideScreen && styles.wideLayout]}>
              {/* Left Side: Room/Table Widget */}
              <View style={isWideScreen ? styles.wideSidebar : styles.mobileSidebar}>
                <TablePanel isCompact={!isWideScreen} />
              </View>

              {/* Center Area: Shaker + Live Ticker + 2x3 Betting Grid */}
              <View style={styles.centerArea}>
                {/* Dealer Shaker Cup & 3 Dice Plate */}
                <DiceShaker
                  currentDice={currentDice}
                  revealedCount={revealedDiceCount}
                  gamePhase={gamePhase}
                  winningSymbols={winningSymbols}
                />

                {/* Live Casino Real-Time Bet Feed Ticker */}
                {isOnline && recentBetsFeed.length > 0 && (
                  <View style={styles.liveFeedBanner}>
                    <View style={styles.liveFeedBadge}>
                      <View style={styles.pulsingRedDot} />
                      <Text style={styles.liveFeedBadgeTxt}>LIVE</Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.liveFeedScroll}
                    >
                      {recentBetsFeed.map((item, idx) => {
                        const symDef = ALL_SYMBOLS[item.symbolId as SymbolId];
                        return (
                          <View key={idx} style={styles.liveFeedItem}>
                            <Text style={styles.liveFeedPlayer}>{item.playerName}:</Text>
                            <Text style={styles.liveFeedSymbol}>
                              {symDef?.nameKhmer || item.symbolId}
                            </Text>
                            <Text style={styles.liveFeedAmount}>
                              +${formatCoins(item.amount)}
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {/* 2x3 Betting Cards Grid */}
                <View style={[styles.gridContainer, { width: cardWidth * 3 + 28 }]}>
                  {/* Row 1: Tiger, Calabash (or Deer), Rooster */}
                  <View style={styles.gridRow}>
                    {activeSymbols.slice(0, 3).map((sym) => {
                      const matchCount = winningSymbols.filter((s) => s === sym.id).length;
                      return (
                        <BetSymbol
                          key={sym.id}
                          symbol={sym}
                          cardWidth={cardWidth}
                          betAmount={currentBets[sym.id] || 0}
                          roomBets={symbolRoomBets[sym.id]}
                          isOnline={isOnline}
                          isHost={isHost}
                          matchCount={matchCount}
                          disabled={gamePhase !== 'betting'}
                          onPress={() => handlePressSymbol(sym.id)}
                          onLongPress={() => removeBet(sym.id)}
                        />
                      );
                    })}
                  </View>

                  {/* Row 2: Shrimp, Crab, Fish */}
                  <View style={styles.gridRow}>
                    {activeSymbols.slice(3, 6).map((sym) => {
                      const matchCount = winningSymbols.filter((s) => s === sym.id).length;
                      return (
                        <BetSymbol
                          key={sym.id}
                          symbol={sym}
                          cardWidth={cardWidth}
                          betAmount={currentBets[sym.id] || 0}
                          roomBets={symbolRoomBets[sym.id]}
                          isOnline={isOnline}
                          isHost={isHost}
                          matchCount={matchCount}
                          disabled={gamePhase !== 'betting'}
                          onPress={() => handlePressSymbol(sym.id)}
                          onLongPress={() => removeBet(sym.id)}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Betting Controls */}
            <BetPanel
              selectedChip={selectedChip}
              onSelectChip={selectChip}
              totalBetAmount={totalBetAmount}
              totalRoomBets={totalRoomBets}
              balance={balance}
              onClear={clearBets}
              onDouble={doubleBets}
              onRebet={rebet}
              onStartRoll={startRoll}
              canRebet={canRebet}
              isRolling={gamePhase !== 'betting'}
            />
          </ScrollView>

        {/* Result Announcement Popup */}
        <GameResultModal
          visible={showResultModal}
          result={currentResult}
          onClose={closeResultModal}
        />
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
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  boardLayout: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 20,
  },
  wideSidebar: {
    marginTop: 10,
  },
  mobileSidebar: {
    position: 'absolute',
    left: 12,
    top: 0,
    zIndex: 25,
  },
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hostToastBox: {
    backgroundColor: '#DC2626',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    zIndex: 50,
  },
  hostToastTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  liveFeedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1.2,
    borderColor: 'rgba(245, 186, 19, 0.4)',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  liveFeedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    marginRight: 6,
  },
  pulsingRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveFeedBadgeTxt: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveFeedScroll: {
    alignItems: 'center',
    gap: 8,
  },
  liveFeedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  liveFeedPlayer: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '800',
  },
  liveFeedSymbol: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '800',
  },
  liveFeedAmount: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '900',
  },
});
