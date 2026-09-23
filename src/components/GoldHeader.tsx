import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, G, Circle } from 'react-native-svg';

import { FONTS } from '../constants/theme';

interface Props {
  titleKhmer?: string;
  subtitle?: string;
}

export const GoldHeader: React.FC<Props> = ({
  titleKhmer = 'ខ្លាឃ្លោក ភូមិយើង',
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeWrapper}>
        <Svg width={260} height={58} viewBox="0 0 260 58">
          <Defs>
            {/* Outer Gold Gradient */}
            <LinearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFE082" />
              <Stop offset="30%" stopColor="#FFB300" />
              <Stop offset="70%" stopColor="#FFD54F" />
              <Stop offset="100%" stopColor="#FF8F00" />
            </LinearGradient>
            {/* Inner Dark Wood/Bronze Gradient */}
            <LinearGradient id="innerPlaqueBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3E2723" />
              <Stop offset="50%" stopColor="#1B1210" />
              <Stop offset="100%" stopColor="#2E1C14" />
            </LinearGradient>
          </Defs>

          {/* Left Scroll / Kbach Spiral */}
          <G transform="translate(18, 29)">
            <Path
              d="M0 0 C-10 -14 -16 6 -6 10 C2 13 4 5 0 0"
              stroke="url(#goldBorderGrad)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="-6" cy="7" r="2" fill="#FFB300" />
          </G>

          {/* Right Scroll / Kbach Spiral */}
          <G transform="translate(242, 29)">
            <Path
              d="M0 0 C10 -14 16 6 6 10 C-2 13 -4 5 0 0"
              stroke="url(#goldBorderGrad)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx="6" cy="7" r="2" fill="#FFB300" />
          </G>

          {/* Main Gold Cartouche Outer */}
          <Rect
            x="24"
            y="6"
            width="212"
            height="46"
            rx="23"
            fill="url(#goldBorderGrad)"
            stroke="#8D5B00"
            strokeWidth="1.5"
          />

          {/* Inner Inset Plaque */}
          <Rect
            x="28"
            y="10"
            width="204"
            height="38"
            rx="19"
            fill="url(#innerPlaqueBg)"
            stroke="#FFE082"
            strokeWidth="1.2"
          />

          {/* Decorative Corner Dots */}
          <Circle cx="38" cy="29" r="2.5" fill="#FFD54F" />
          <Circle cx="222" cy="29" r="2.5" fill="#FFD54F" />
        </Svg>

        {/* Khmer Calligraphy Text Overlay */}
        <View style={[styles.textContainer, { pointerEvents: 'none' as any }]}>
          <Text style={styles.titleKhmer}>{titleKhmer}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 6,
    zIndex: 15,
  },
  badgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 36,
  },
  titleKhmer: {
    fontFamily: FONTS.khmerBlack,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFE082',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
