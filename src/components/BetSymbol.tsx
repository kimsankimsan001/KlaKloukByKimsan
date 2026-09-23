import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SymbolDefinition } from '../types';
import { SymbolIconRenderer } from './AnimalIcons';
import { COLORS, FONTS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';

interface Props {
  symbol: SymbolDefinition;
  betAmount: number;
  isSelected?: boolean;
  matchCount?: number;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  cardWidth?: number;
}

export const BetSymbol: React.FC<Props> = ({
  symbol,
  betAmount,
  isSelected = false,
  matchCount = 0,
  onPress,
  onLongPress,
  disabled = false,
  cardWidth = 100,
}) => {
  const hasBet = betAmount > 0;
  const isWinning = matchCount > 0;
  const cardHeight = cardWidth * 1.05;
  const iconSize = Math.max(48, Math.min(cardWidth * 0.65, 84));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[
        styles.touchableWrapper,
        { width: cardWidth, height: cardHeight },
      ]}
    >
      <View
        style={[
          styles.cardContainer,
          hasBet && styles.cardWithBet,
          isWinning && styles.cardWinning,
        ]}
      >
        {/* Ornate Teal Kbach Border Background */}
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' as any }]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 105" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="kbachTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#00A3A8" />
                <Stop offset="100%" stopColor="#00666A" />
              </LinearGradient>
            </Defs>

            {/* Inner Border Frame */}
            <Rect
              x="6"
              y="6"
              width="88"
              height="93"
              rx="6"
              fill="none"
              stroke="url(#kbachTealGrad)"
              strokeWidth="2.5"
            />
            <Rect
              x="9"
              y="9"
              width="82"
              height="87"
              rx="4"
              fill="none"
              stroke="#00828A"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Ornate Corner Scrollwork */}
            {/* Top-Left */}
            <G transform="translate(6, 6)">
              <Path
                d="M0 14 C4 4 10 2 14 0 M2 8 C6 4 8 2 12 2"
                stroke="#00828A"
                strokeWidth="1.8"
                fill="none"
              />
            </G>
            {/* Top-Right */}
            <G transform="translate(94, 6) scale(-1, 1)">
              <Path
                d="M0 14 C4 4 10 2 14 0 M2 8 C6 4 8 2 12 2"
                stroke="#00828A"
                strokeWidth="1.8"
                fill="none"
              />
            </G>
            {/* Bottom-Left */}
            <G transform="translate(6, 99) scale(1, -1)">
              <Path
                d="M0 14 C4 4 10 2 14 0 M2 8 C6 4 8 2 12 2"
                stroke="#00828A"
                strokeWidth="1.8"
                fill="none"
              />
            </G>
            {/* Bottom-Right */}
            <G transform="translate(94, 99) scale(-1, -1)">
              <Path
                d="M0 14 C4 4 10 2 14 0 M2 8 C6 4 8 2 12 2"
                stroke="#00828A"
                strokeWidth="1.8"
                fill="none"
              />
            </G>
          </Svg>
        </View>

        {/* Animal Illustration Medal */}
        <View style={styles.iconContainer}>
          <SymbolIconRenderer symbolId={symbol.id} size={iconSize} />
        </View>

        {/* Symbol Names (Khmer + English) */}
        <View style={styles.labelContainer}>
          <Text style={styles.khmerName}>{symbol.nameKhmer}</Text>
          <Text style={styles.englishName}>{symbol.nameEnglish}</Text>
        </View>

        {/* Bet Badge (matching the $60000 badge in reference image) */}
        {hasBet && (
          <View style={styles.betBadge}>
            <Text style={styles.betBadgeText}>${formatCoins(betAmount)}</Text>
          </View>
        )}

        {/* Winning Multiplier Badge */}
        {isWinning && (
          <View style={styles.winBadge}>
            <Text style={styles.winBadgeText}>+{matchCount}x</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    margin: 4,
    borderRadius: 14,
    outlineStyle: 'none' as any,
    cursor: 'pointer' as any,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FAF8F2',
    borderRadius: 14,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  // Active Bet Style matching reference image (Fish card with vibrant gold border)
  cardWithBet: {
    borderColor: '#F5BA13',
    borderWidth: 4,
    backgroundColor: '#FFFDF0',
    shadowColor: '#F5BA13',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  cardWinning: {
    borderColor: '#10B981',
    borderWidth: 4,
    backgroundColor: '#F0FDF4',
    shadowColor: '#10B981',
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  khmerName: {
    fontFamily: FONTS.khmerBold,
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
    lineHeight: 18,
  },
  englishName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  // Chip tag matching the reference image's dark badge on top-left of card
  betBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#0F172A',
    borderColor: '#F5BA13',
    borderWidth: 1.5,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  betBadgeText: {
    color: '#F5BA13',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  winBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#10B981',
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  winBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
