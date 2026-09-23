import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Platform } from 'react-native';
import Svg, {
  Ellipse,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Circle,
  Rect,
} from 'react-native-svg';
import { DiceResult, GamePhase, SymbolId } from '../types';
import { Dice } from './Dice';
import { COLORS, FONTS } from '../constants/theme';

interface Props {
  currentDice: DiceResult;
  revealedCount: number;
  gamePhase: GamePhase;
  winningSymbols?: SymbolId[];
}

export const DiceShaker: React.FC<Props> = ({
  currentDice,
  revealedCount,
  gamePhase,
  winningSymbols = [],
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cupLiftAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';

  // Handle shake animation
  useEffect(() => {
    if (gamePhase === 'shaking') {
      cupLiftAnim.setValue(0);
      const shakeSequence = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: useNative,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 50,
            useNativeDriver: useNative,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0.8,
            duration: 50,
            useNativeDriver: useNative,
          }),
          Animated.timing(shakeAnim, {
            toValue: -0.8,
            duration: 50,
            useNativeDriver: useNative,
          }),
        ])
      );
      shakeSequence.start();

      return () => {
        shakeSequence.stop();
        shakeAnim.setValue(0);
      };
    } else {
      shakeAnim.setValue(0);
      // Lift cup smoothly when revealing/result
      Animated.spring(cupLiftAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: useNative,
      }).start();
    }
  }, [gamePhase, useNative]);

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-12, 12],
  });

  const shakeRotate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg'],
  });

  const cupTranslateY = cupLiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -110],
  });

  const cupOpacity = cupLiftAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0.7, 0],
  });

  return (
    <View style={styles.container}>
      {/* Traditional Khmer Dealer Plate */}
      <View style={styles.plateWrapper}>
        <Svg width={280} height={110} viewBox="0 0 280 110">
          <Defs>
            {/* Outer Brass / Gold Plate Rim */}
            <LinearGradient id="plateRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFE082" />
              <Stop offset="40%" stopColor="#D4AF37" />
              <Stop offset="80%" stopColor="#996515" />
              <Stop offset="100%" stopColor="#5D3A00" />
            </LinearGradient>
            {/* Deep Crimson Velvet Center */}
            <RadialGradient id="plateVelvet" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#991B1B" />
              <Stop offset="80%" stopColor="#7F1D1D" />
              <Stop offset="100%" stopColor="#450A0A" />
            </RadialGradient>
          </Defs>

          {/* Plate Shadow */}
          <Ellipse cx="140" cy="65" rx="136" ry="42" fill="rgba(0,0,0,0.55)" />

          {/* Outer Gold Tier */}
          <Ellipse cx="140" cy="56" rx="134" ry="40" fill="url(#plateRimGrad)" stroke="#5D3A00" strokeWidth="2" />
          <Ellipse cx="140" cy="54" rx="126" ry="36" fill="#8D5B00" />

          {/* Inner Red Velvet Surface */}
          <Ellipse
            cx="140"
            cy="52"
            rx="122"
            ry="33"
            fill="url(#plateVelvet)"
            stroke="#F5BA13"
            strokeWidth="1.5"
          />

          {/* Traditional Plate Rim Pattern Dots */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 2 * Math.PI;
            const x = 140 + 128 * Math.cos(angle);
            const y = 54 + 37 * Math.sin(angle);
            return <Circle key={i} cx={x} cy={y} r="2" fill="#FFE082" opacity="0.85" />;
          })}
        </Svg>

        {/* The Three Dice Placed on the Plate */}
        <View style={styles.diceRow}>
          {currentDice.map((symbol, index) => {
            const isRevealed = gamePhase !== 'shaking' && index < revealedCount;
            const isWinning = isRevealed && winningSymbols.includes(symbol);

            return (
              <Dice
                key={`dice-${index}`}
                symbol={symbol}
                size={58}
                isRevealed={isRevealed}
                isWinning={isWinning}
              />
            );
          })}
        </View>
      </View>

      {/* Animated Dealer Cup (Lid) */}
      <Animated.View
        style={[
          styles.cupContainer,
          { pointerEvents: 'none' as any },
          {
            transform: [
              { translateX: shakeTranslateX },
              { translateY: cupTranslateY },
              { rotate: shakeRotate },
            ],
            opacity: cupOpacity,
          },
        ]}
      >
        <Svg width={200} height={140} viewBox="0 0 200 140">
          <Defs>
            <LinearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4A2810" />
              <Stop offset="25%" stopColor="#8A4815" />
              <Stop offset="50%" stopColor="#F5BA13" />
              <Stop offset="75%" stopColor="#8A4815" />
              <Stop offset="100%" stopColor="#301505" />
            </LinearGradient>
            <LinearGradient id="cupGoldBand" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFE082" />
              <Stop offset="50%" stopColor="#FFB300" />
              <Stop offset="100%" stopColor="#8D5B00" />
            </LinearGradient>
          </Defs>

          {/* Cup Finial Handle */}
          <Circle cx="100" cy="14" r="9" fill="url(#cupGoldBand)" stroke="#5D3A00" strokeWidth="1.5" />
          <Rect x="96" y="21" width="8" height="8" rx="2" fill="url(#cupGoldBand)" />

          {/* Dome Shaped Cup Body */}
          <Path
            d="M30 115 C30 50 60 25 100 25 C140 25 170 50 170 115 Z"
            fill="url(#cupGrad)"
            stroke="#5D3A00"
            strokeWidth="2.5"
          />

          {/* Gold Decorative Bands */}
          <Path
            d="M48 65 Q 100 75 152 65"
            stroke="url(#cupGoldBand)"
            strokeWidth="4"
            fill="none"
          />
          <Path
            d="M34 98 Q 100 110 166 98"
            stroke="url(#cupGoldBand)"
            strokeWidth="5"
            fill="none"
          />

          {/* Cup Rim Base */}
          <Ellipse cx="100" cy="116" rx="72" ry="12" fill="url(#cupGoldBand)" stroke="#5D3A00" strokeWidth="2" />
        </Svg>
      </Animated.View>

      {/* Shaking Status Pill */}
      {gamePhase === 'shaking' && (
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>កំពុងក្រឡុក... (SHAKING)</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    height: 120,
    position: 'relative',
  },
  plateWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diceRow: {
    position: 'absolute',
    top: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 5,
  },
  cupContainer: {
    position: 'absolute',
    top: -15,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#F5BA13',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 20,
  },
  statusPillText: {
    fontFamily: FONTS.khmerBold,
    color: '#F5BA13',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
