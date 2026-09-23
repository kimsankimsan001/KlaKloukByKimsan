import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { SymbolId } from '../types';
import { SymbolIconRenderer } from './AnimalIcons';

interface DiceProps {
  symbol: SymbolId;
  size?: number;
  isRevealed?: boolean;
  isWinning?: boolean;
}

export const Dice: React.FC<DiceProps> = ({
  symbol,
  size = 64,
  isRevealed = true,
  isWinning = false,
}) => {
  const iconSize = Math.round(size * 0.72);

  if (!isRevealed) {
    // Hidden / rolling state dice face
    return (
      <View style={[styles.diceContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="hiddenDiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FAF5E8" />
              <Stop offset="100%" stopColor="#D6CBB8" />
            </LinearGradient>
          </Defs>
          <Rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="18"
            fill="url(#hiddenDiceGrad)"
            stroke="#A89F8D"
            strokeWidth="3"
          />
          {/* Mystery Question mark / rolling swirl */}
          <Circle cx="50" cy="50" r="14" fill="#C4B9A5" />
          <Circle cx="50" cy="50" r="8" fill="#FAF5E8" />
        </Svg>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.diceContainer,
        { width: size, height: size },
        isWinning && styles.diceWinning,
      ]}
    >
      {/* 3D Dice Face Background */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="diceFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="85%" stopColor="#F5EFE3" />
              <Stop offset="100%" stopColor="#E2D7C3" />
            </LinearGradient>
            <LinearGradient id="diceBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F5BA13" />
              <Stop offset="100%" stopColor="#8A5800" />
            </LinearGradient>
          </Defs>

          {/* 3D Bottom Bevel Shadow */}
          <Rect
            x="2"
            y="6"
            width="96"
            height="92"
            rx="18"
            fill="#B8AA94"
          />

          {/* Main Ivory Face */}
          <Rect
            x="2"
            y="2"
            width="96"
            height="92"
            rx="18"
            fill="url(#diceFaceGrad)"
            stroke={isWinning ? '#10B981' : '#D1C4AF'}
            strokeWidth={isWinning ? 4 : 2}
          />

          {/* Golden Corner Accents */}
          <Circle cx="16" cy="16" r="2.5" fill="#D4AF37" opacity="0.6" />
          <Circle cx="84" cy="16" r="2.5" fill="#D4AF37" opacity="0.6" />
          <Circle cx="16" cy="80" r="2.5" fill="#D4AF37" opacity="0.6" />
          <Circle cx="84" cy="80" r="2.5" fill="#D4AF37" opacity="0.6" />
        </Svg>
      </View>

      {/* Central Symbol Icon */}
      <View style={styles.symbolIconWrapper}>
        <SymbolIconRenderer symbolId={symbol} size={iconSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  diceContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
    marginHorizontal: 4,
    position: 'relative',
  },
  diceWinning: {
    shadowColor: '#10B981',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
  symbolIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
