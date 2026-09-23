import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Polygon, G, Line } from 'react-native-svg';

const FLAG_COLORS = [
  '#00D2D3', // Cyan
  '#FF7675', // Coral pink
  '#2ED573', // Green
  '#FFA502', // Orange/Yellow
  '#9B59B6', // Purple
  '#E056FD', // Bright violet
  '#1DD1A1', // Mint
  '#FF9F43', // Amber
  '#54A0FF', // Sky blue
];

export const FestiveBunting: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const flagCount = Math.max(10, Math.floor(screenWidth / 36));
  const flagWidth = screenWidth / flagCount;

  return (
    <View style={[styles.container, { pointerEvents: 'none' as any }]}>
      <Svg width={screenWidth} height={52} viewBox={`0 0 ${screenWidth} 52`}>
        {/* Hanging rope curve */}
        <Path
          d={`M0 8 Q ${screenWidth / 4} 16, ${screenWidth / 2} 12 T ${screenWidth} 8`}
          stroke="#4A3728"
          strokeWidth="2"
          fill="none"
        />

        {/* Triangle Pennants */}
        <G>
          {Array.from({ length: flagCount }).map((_, index) => {
            const x1 = index * flagWidth;
            const x2 = (index + 1) * flagWidth;
            const midX = (x1 + x2) / 2;
            const yTop = 8 + Math.sin((index / flagCount) * Math.PI) * 5;
            const yBottom = yTop + 28 + (index % 2 === 0 ? 4 : 0);
            const color = FLAG_COLORS[index % FLAG_COLORS.length];

            return (
              <G key={index}>
                <Polygon
                  points={`${x1},${yTop} ${x2},${yTop} ${midX},${yBottom}`}
                  fill={color}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1"
                />
                {/* Optional subtle stripes on some flags */}
                {index % 3 === 0 && (
                  <Line
                    x1={x1 + 3}
                    y1={yTop + 8}
                    x2={x2 - 3}
                    y2={yTop + 8}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />
                )}
                {index % 3 === 0 && (
                  <Line
                    x1={x1 + 6}
                    y1={yTop + 16}
                    x2={x2 - 6}
                    y2={yTop + 16}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />
                )}
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 52,
    overflow: 'hidden',
  },
});
