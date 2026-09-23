import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';
import { formatCoins } from '../services/gameLogic';

interface Props {
  balance: number;
  roundNumber: number;
  onClaimFreeCoins?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
  onNavigateHome?: () => void;
}

export const CoinDisplay: React.FC<Props> = ({
  balance,
  roundNumber,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenSettings,
  onNavigateHome,
}) => {
  return (
    <View style={styles.topBar}>
      {/* Left: Home Menu Button & Round Badge */}
      <View style={styles.leftGroup}>
        {onNavigateHome && (
          <TouchableOpacity
            style={styles.menuBtn}
            activeOpacity={0.7}
            onPress={onNavigateHome}
          >
            <Text style={styles.menuBtnText}>🏠 MENU</Text>
          </TouchableOpacity>
        )}
        <View style={styles.roundBadge}>
          <Text style={styles.roundText}>ROUND #{roundNumber}</Text>
        </View>
      </View>

      {/* Center: Coin Balance Display */}
      <View style={styles.balanceContainer}>
        {/* Golden Coin Icon */}
        <Svg width={26} height={26} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFF176" />
              <Stop offset="50%" stopColor="#F5BA13" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
          </Defs>
          <Circle cx="50" cy="50" r="47" fill="url(#goldCoinGrad)" stroke="#B45309" strokeWidth="4" />
          <Circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />
          {/* Cambodian Angkor/Khmer symbol or Dollar/Star in center */}
          <Circle cx="50" cy="50" r="24" fill="#B45309" />
          <Rect x="42" y="32" width="16" height="36" rx="2" fill="#FFE082" />
          <Circle cx="50" cy="50" r="8" fill="#F5BA13" />
        </Svg>

        <Text style={styles.balanceAmount}>{formatCoins(balance)}</Text>
      </View>

      {/* Right: Quick Action Icons */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.7}
          onPress={onToggleSound}
        >
          <Text style={styles.iconEmoji}>{soundEnabled ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>

        {onOpenHistory && (
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
            onPress={onOpenHistory}
          >
            <Text style={styles.iconEmoji}>📜</Text>
          </TouchableOpacity>
        )}

        {onOpenSettings && (
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
            onPress={onOpenSettings}
          >
            <Text style={styles.iconEmoji}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 14,
    width: '100%',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuBtn: {
    backgroundColor: 'rgba(245, 186, 19, 0.18)',
    borderWidth: 1.2,
    borderColor: '#F5BA13',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuBtnText: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roundBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roundText: {
    color: '#FFE082',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1.8,
    borderColor: '#F5BA13',
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  balanceAmount: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  refillBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  refillBtnText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 14,
  },
});
