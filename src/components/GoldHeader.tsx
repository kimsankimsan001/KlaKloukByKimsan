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
  const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0);
  const svgHeight = hasSubtitle ? 66 : 58;
  const centerY = svgHeight / 2;
  const outerHeight = hasSubtitle ? 52 : 46;
  const outerY = (svgHeight - outerHeight) / 2;
  const innerHeight = hasSubtitle ? 44 : 38;
  const innerY = (svgHeight - innerHeight) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.badgeWrapper}>
        <Svg width={270} height={svgHeight} viewBox={`0 0 270 ${svgHeight}`}>
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
          <G transform={`translate(18, ${centerY})`}>
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
          <G transform={`translate(252, ${centerY})`}>
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
            y={outerY}
            width="222"
            height={outerHeight}
            rx={outerHeight / 2}
            fill="url(#goldBorderGrad)"
            stroke="#8D5B00"
            strokeWidth="1.5"
          />

          {/* Inner Inset Plaque */}
          <Rect
            x="28"
            y={innerY}
            width="214"
            height={innerHeight}
            rx={innerHeight / 2}
            fill="url(#innerPlaqueBg)"
            stroke="#FFE082"
            strokeWidth="1.2"
          />

          {/* Decorative Corner Dots */}
          <Circle cx="39" cy={centerY} r="2.5" fill="#FFD54F" />
          <Circle cx="231" cy={centerY} r="2.5" fill="#FFD54F" />
        </Svg>

        {/* Khmer Calligraphy Text Overlay */}
        <View style={[styles.textContainer, { pointerEvents: 'none' as any }]}>
          <Text style={styles.titleKhmer}>{titleKhmer}</Text>
          {hasSubtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
    paddingHorizontal: 40,
  },
  titleKhmer: {
    fontFamily: FONTS.khmerBlack,
    fontSize: 21,
    lineHeight: 32,
    color: '#FFE082',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FCD34D',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
});
