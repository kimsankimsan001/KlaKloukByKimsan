import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { getActiveSymbols } from '../constants/symbols';
import { FestiveBunting } from '../components/FestiveBunting';
import { GoldHeader } from '../components/GoldHeader';
import { TablePanel } from '../components/TablePanel';
import { BetSymbol } from '../components/BetSymbol';
import { DiceShaker } from '../components/DiceShaker';
import { BetPanel } from '../components/BetPanel';
import { CoinDisplay } from '../components/CoinDisplay';
import { GameResultModal } from '../components/GameResultModal';
import { COLORS } from '../constants/theme';
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
  const { width, height } = useWindowDimensions();

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
    selectChip,
    placeBet,
    removeBet,
    clearBets,
    doubleBets,
    rebet,
    startRoll,
    closeResultModal,
    claimFreeCoins,
    updateSettings,
  } = useGameStore();

  const isWideScreen = width >= 768; // Tablet or Landscape
  const activeSymbols = useMemo(
    () => getActiveSymbols(settings.symbolVariant),
    [settings.symbolVariant]
  );

  // Responsive card sizing
  // 3 columns of cards
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
          onClaimFreeCoins={claimFreeCoins}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onOpenHistory={onNavigateHistory}
          onOpenSettings={onNavigateSettings}
        />

        {/* Ornate Khmer Title Plaque matching reference */}
        <GoldHeader
          titleKhmer="ខ្លាឃ្លោក ភូមិយើង"
          subtitle={settings.language === 'en' ? 'Khmer Kla Klouk Casino' : undefined}
        />

        {/* Main Gaming Arena */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.boardLayout, isWideScreen && styles.wideLayout]}>
            {/* Left Side: Room/Table Widget (Pinned on wide screens, compact on phones) */}
            <View style={isWideScreen ? styles.wideSidebar : styles.mobileSidebar}>
              <TablePanel isCompact={!isWideScreen} />
            </View>

            {/* Center Area: Shaker + 2x3 Betting Grid */}
            <View style={styles.centerArea}>
              {/* Dealer Shaker Cup & 3 Dice Plate */}
              <DiceShaker
                currentDice={currentDice}
                revealedCount={revealedDiceCount}
                gamePhase={gamePhase}
                winningSymbols={winningSymbols}
              />

              {/* 2x3 Betting Cards Grid matching reference */}
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
                        matchCount={matchCount}
                        disabled={gamePhase !== 'betting'}
                        onPress={() => placeBet(sym.id)}
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
                        matchCount={matchCount}
                        disabled={gamePhase !== 'betting'}
                        onPress={() => placeBet(sym.id)}
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
});
