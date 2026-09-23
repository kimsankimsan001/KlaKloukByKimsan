import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Circle, Rect, G } from 'react-native-svg';
import { CHIP_COLORS, CHIP_VALUES, COLORS, FONTS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';

interface Props {
  selectedChip: number;
  onSelectChip: (chip: number) => void;
  totalBetAmount: number;
  balance: number;
  onClear: () => void;
  onDouble: () => void;
  onRebet: () => void;
  onStartRoll: () => void;
  canRebet: boolean;
  isRolling: boolean;
}

export const BetPanel: React.FC<Props> = ({
  selectedChip,
  onSelectChip,
  totalBetAmount,
  balance,
  onClear,
  onDouble,
  onRebet,
  onStartRoll,
  canRebet,
  isRolling,
}) => {
  const hasBets = totalBetAmount > 0;
  const canStart = hasBets && !isRolling;

  return (
    <View style={styles.container}>
      {/* Chip Selector Row */}
      <View style={styles.chipRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContent}
        >
          {CHIP_VALUES.map((chip) => {
            const isSelected = selectedChip === chip;
            const chipStyle = CHIP_COLORS[chip];
            const canAfford = balance >= chip;

            return (
              <TouchableOpacity
                key={`chip-${chip}`}
                activeOpacity={0.7}
                disabled={isRolling}
                onPress={() => onSelectChip(chip)}
                style={[
                  styles.chipTouch,
                  isSelected && styles.chipSelected,
                  !canAfford && styles.chipDisabled,
                ]}
              >
                {/* Circular Golden Glow Ring for Selected Coin */}
                {isSelected && (
                  <View style={styles.circularGlowRing} pointerEvents="none" />
                )}

                <Svg width={48} height={48} viewBox="0 0 100 100">
                  {/* Outer Chip Rim */}
                  <Circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill={chipStyle.bg}
                    stroke={isSelected ? '#FFE082' : chipStyle.border}
                    strokeWidth={isSelected ? 5 : 3}
                  />

                  {/* Golden Selection Aura Ring */}
                  {isSelected && (
                    <Circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="3"
                    />
                  )}

                  {/* Striped Poker Chip Edge notches */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x = 50 + 40 * Math.cos(angle);
                    const y = 50 + 40 * Math.sin(angle);
                    return (
                      <Circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#FFFFFF"
                        opacity={0.85}
                      />
                    );
                  })}

                  {/* Inner Dashed Ring */}
                  <Circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity={0.7}
                  />

                  {/* Inner Core */}
                  <Circle cx="50" cy="50" r="28" fill={chipStyle.bg} />
                </Svg>

                {/* Denomination Value */}
                <View style={[styles.chipTextWrapper, { pointerEvents: 'none' as any }]}>
                  <Text style={[styles.chipText, { color: chipStyle.text }]}>
                    {chip >= 1000 ? `${chip / 1000}K` : chip}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Action Utilities & Grand Start Button */}
      <View style={styles.actionsRow}>
        {/* Clear Button */}
        <TouchableOpacity
          style={[styles.utilButton, (!hasBets || isRolling) && styles.btnDisabled]}
          disabled={!hasBets || isRolling}
          onPress={onClear}
        >
          <Text style={styles.utilBtnText}>CLEAR</Text>
          <Text style={styles.utilBtnSub}>សំអាត</Text>
        </TouchableOpacity>

        {/* Centerpiece Grand Start Button (Matching "ចាប់ផ្តើម" from reference image!) */}
        <TouchableOpacity
          style={[
            styles.startBigButton,
            canStart ? styles.startBigButtonActive : styles.btnDisabled,
          ]}
          disabled={!canStart}
          activeOpacity={0.8}
          onPress={onStartRoll}
        >
          <Text style={styles.startKhmerText}>ចាប់ផ្តើម</Text>
          {totalBetAmount > 0 && (
            <Text style={styles.startBetSub}>
              ${formatCoins(totalBetAmount)}
            </Text>
          )}
        </TouchableOpacity>

        {/* Double / Rebet Button */}
        <TouchableOpacity
          style={[
            styles.utilButton,
            (!hasBets && !canRebet) || isRolling ? styles.btnDisabled : null,
          ]}
          disabled={(!hasBets && !canRebet) || isRolling}
          onPress={hasBets ? onDouble : onRebet}
        >
          <Text style={styles.utilBtnText}>{hasBets ? '2X' : 'REBET'}</Text>
          <Text style={styles.utilBtnSub}>{hasBets ? 'គុណ២' : 'ដដែល'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    width: '100%',
  },
  chipRow: {
    height: 70,
    marginBottom: 6,
    width: '100%',
    overflow: 'visible' as any,
  },
  chipScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    overflow: 'visible' as any,
  },
  chipTouch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    outlineStyle: 'none' as any,
    outlineWidth: 0 as any,
  },
  chipSelected: {
    borderRadius: 26,
    transform: [{ scale: 1.12 }],
    shadowColor: '#F5BA13',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  circularGlowRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 9999,
    borderWidth: 2.5,
    borderColor: '#FFE082',
    backgroundColor: 'rgba(245, 186, 19, 0.25)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 10,
  },
  utilButton: {
    flex: 1,
    maxWidth: 85,
    height: 46,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    outlineStyle: 'none' as any,
    cursor: 'pointer' as any,
  },
  utilBtnText: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  utilBtnSub: {
    fontFamily: FONTS.khmerBold,
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '700',
  },
  // Grand Start Button matching reference image
  startBigButton: {
    flex: 2,
    maxWidth: 160,
    height: 48,
    backgroundColor: '#0F1216',
    borderWidth: 2.5,
    borderColor: '#F5BA13',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 8,
    outlineStyle: 'none' as any,
    cursor: 'pointer' as any,
  },
  startBigButtonActive: {
    borderColor: '#FFD700',
    shadowColor: '#F5BA13',
    shadowOpacity: 0.85,
    shadowRadius: 10,
    backgroundColor: '#181205',
  },
  startKhmerText: {
    fontFamily: FONTS.khmerBlack,
    color: '#F5BA13',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  startBetSub: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnDisabled: {
    opacity: 0.4,
    borderColor: '#6B7280',
  },
});
