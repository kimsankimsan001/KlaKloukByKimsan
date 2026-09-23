import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
} from 'react-native-svg';
import { SymbolId } from '../types';

interface IconProps {
  size?: number;
}

export const TigerIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="tigerBg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFF176" />
        <Stop offset="100%" stopColor="#F59E0B" />
      </RadialGradient>
      <LinearGradient id="tigerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#F59E0B" />
        <Stop offset="100%" stopColor="#D97706" />
      </LinearGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#tigerBg)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Tiger Head */}
    <G>
      {/* Ears */}
      <Path d="M26 30 C20 18 34 16 38 28 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
      <Path d="M28 28 C23 20 32 19 35 27 Z" fill="#FEE2E2" />
      <Path d="M74 30 C80 18 66 16 62 28 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
      <Path d="M72 28 C77 20 68 19 65 27 Z" fill="#FEE2E2" />

      {/* Main Face Contour */}
      <Path
        d="M26 44 C24 64 36 78 50 78 C64 78 76 64 74 44 C74 32 63 26 50 26 C37 26 26 32 26 44 Z"
        fill="url(#tigerGold)"
        stroke="#78350F"
        strokeWidth="1.5"
      />

      {/* White Cheeks & Muzzle */}
      <Path
        d="M32 54 C32 68 42 74 50 74 C58 74 68 68 68 54 C66 48 58 52 50 52 C42 52 34 48 32 54 Z"
        fill="#FFFFFF"
      />

      {/* Tiger Stripes */}
      {/* Forehead "King" mark (王) */}
      <Path d="M43 31 L57 31" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M45 35 L55 35" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M50 30 L50 40" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

      {/* Side Stripes */}
      <Path d="M27 42 L34 44 L28 48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M73 42 L66 44 L72 48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <Ellipse cx="40" cy="44" rx="4" ry="3" fill="#FEF08A" stroke="#1F2937" strokeWidth="1.2" />
      <Circle cx="40" cy="44" r="1.8" fill="#111827" />
      <Ellipse cx="60" cy="44" rx="4" ry="3" fill="#FEF08A" stroke="#1F2937" strokeWidth="1.2" />
      <Circle cx="60" cy="44" r="1.8" fill="#111827" />

      {/* Nose */}
      <Path d="M46 54 L54 54 L50 58 Z" fill="#F87171" stroke="#991B1B" strokeWidth="1" />

      {/* Mouth */}
      <Path d="M50 58 L50 63" stroke="#1F2937" strokeWidth="1.5" />
      <Path d="M44 63 C47 66 50 64 50 63 C50 64 53 66 56 63" fill="none" stroke="#1F2937" strokeWidth="1.5" />

      {/* Whiskers */}
      <Path d="M30 60 L18 58" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M30 63 L19 65" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M70 60 L82 58" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M70 63 L81 65" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
    </G>
  </Svg>
);

export const CalabashIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="gourdBg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFF176" />
        <Stop offset="100%" stopColor="#FBBF24" />
      </RadialGradient>
      <LinearGradient id="gourdRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#EF4444" />
        <Stop offset="100%" stopColor="#B91C1C" />
      </LinearGradient>
      <RadialGradient id="gourdHighlight" cx="35%" cy="35%" r="45%">
        <Stop offset="0%" stopColor="#FCA5A5" />
        <Stop offset="70%" stopColor="#DC2626" />
        <Stop offset="100%" stopColor="#7F1D1D" />
      </RadialGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#gourdBg)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Gourd / Calabash Body */}
    <G>
      {/* Golden Cap / Spout */}
      <Path d="M48 20 L52 20 L51 25 L49 25 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      <Circle cx="50" cy="20" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />

      {/* Top smaller bulb */}
      <Circle cx="50" cy="35" r="12" fill="url(#gourdHighlight)" stroke="#7F1D1D" strokeWidth="1.5" />

      {/* Bottom larger bulb */}
      <Circle cx="50" cy="58" r="20" fill="url(#gourdHighlight)" stroke="#7F1D1D" strokeWidth="1.8" />

      {/* Tied Blue Ribbon / Cord */}
      <Path d="M43 43 C46 45 54 45 57 43" stroke="#2563EB" strokeWidth="3.5" fill="none" />
      {/* Ribbon knot */}
      <Circle cx="50" cy="44" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      {/* Ribbon bows */}
      <Path d="M50 44 C42 41 38 46 47 47 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      <Path d="M50 44 C58 41 62 46 53 47 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      {/* Ribbon tails */}
      <Path d="M49 46 Q44 54 41 58" stroke="#1D4ED8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M51 46 Q56 54 59 58" stroke="#1D4ED8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Subtle shine highlights */}
      <Ellipse cx="45" cy="33" rx="3" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-20 45 33)" />
      <Ellipse cx="43" cy="56" rx="5" ry="9" fill="rgba(255,255,255,0.3)" transform="rotate(-25 43 56)" />
    </G>
  </Svg>
);

export const RoosterIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="roosterSky" cx="50%" cy="30%" r="70%">
        <Stop offset="0%" stopColor="#E0F2FE" />
        <Stop offset="100%" stopColor="#BAE6FD" />
      </RadialGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#roosterSky)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Green grassy hill */}
    <Path d="M12 68 Q50 56 88 68 L88 92 Q50 96 12 92 Z" fill="#65A30D" />
    <Path d="M16 75 Q50 62 84 75 L84 90 Q50 94 16 90 Z" fill="#4D7C0F" />

    {/* Rooster Body */}
    <G>
      {/* Legs */}
      <Path d="M46 64 L44 76 M44 76 L40 78 M44 76 L47 78" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M54 64 L56 76 M56 76 L53 78 M56 76 L59 78" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

      {/* Tail Feathers (Curving majestic black/green/teal feathers) */}
      <Path d="M45 46 Q32 30 22 36 Q28 46 42 54 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      <Path d="M43 48 Q26 36 20 45 Q30 52 41 57 Z" fill="#047857" stroke="#064E3B" strokeWidth="1" />
      <Path d="M42 50 Q28 46 22 56 Q34 58 42 60 Z" fill="#0E7490" stroke="#155E75" strokeWidth="1" />

      {/* Body / Breast */}
      <Path d="M42 46 C42 40 52 42 58 48 C64 54 62 66 50 66 C42 66 40 54 42 46 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.2" />

      {/* Wing */}
      <Path d="M44 48 C50 48 54 52 52 58 C50 64 42 64 44 48 Z" fill="#B45309" stroke="#78350F" strokeWidth="1" />

      {/* Neck Feathers (Golden brown) */}
      <Path d="M52 44 C54 36 60 30 65 30 C66 38 62 46 56 46 Z" fill="#D97706" />

      {/* Head */}
      <Circle cx="64" cy="30" r="5" fill="#DC2626" />

      {/* Comb (Red) */}
      <Path d="M60 27 C60 22 64 22 65 25 C67 22 71 22 70 27 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />

      {/* Wattle (Red) */}
      <Path d="M66 34 C68 38 64 40 63 36 Z" fill="#EF4444" />

      {/* Beak */}
      <Path d="M68 29 L74 31 L68 33 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />

      {/* Eye */}
      <Circle cx="63" cy="29" r="1.2" fill="#1F2937" />
    </G>
  </Svg>
);

export const ShrimpIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="seaBg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#7DD3FC" />
        <Stop offset="100%" stopColor="#0284C7" />
      </RadialGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#seaBg)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Coral / Sea floor */}
    <Path d="M15 80 Q50 72 85 80 L85 92 Q50 94 15 92 Z" fill="#0369A1" opacity="0.6" />
    <Path d="M22 84 Q26 76 30 84" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
    <Path d="M70 85 Q75 75 78 86" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />

    {/* Shrimp / Prawn */}
    <G>
      {/* Whiskers (Long antennae) */}
      <Path d="M64 46 Q78 30 85 24" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M64 48 Q82 40 88 42" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Curved Segmented Body */}
      {/* Head / Carapace */}
      <Path
        d="M52 42 C56 36 68 40 68 48 C68 56 58 58 50 54 Z"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="1.5"
      />
      {/* Rostrum (head spike) */}
      <Path d="M66 44 L75 42 L66 47 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />

      {/* Segment 1 */}
      <Path d="M51 46 C44 42 38 48 42 56 C46 58 52 54 51 46 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
      {/* Segment 2 */}
      <Path d="M42 50 C36 48 30 54 34 62 C38 64 44 60 42 50 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
      {/* Segment 3 */}
      <Path d="M34 56 C28 58 24 66 30 72 C35 72 38 66 34 56 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
      {/* Tail fan (Telson) */}
      <Path d="M30 70 Q20 74 18 80 Q26 78 30 73 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
      <Path d="M28 72 Q24 82 28 85 Q31 78 31 72 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1" />

      {/* Swimmerets / Legs */}
      <Path d="M44 60 L42 66" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M48 58 L48 65" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <Path d="M54 54 L56 62" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

      {/* Eye */}
      <Circle cx="62" cy="44" r="2.5" fill="#111827" />
      <Circle cx="63" cy="43" r="0.8" fill="#FFFFFF" />
    </G>
  </Svg>
);

export const CrabIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="crabBg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFF176" />
        <Stop offset="100%" stopColor="#FBBF24" />
      </RadialGradient>
      <LinearGradient id="crabPurple" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#5B21B6" />
      </LinearGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#crabBg)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Crab */}
    <G>
      {/* Walking Legs (4 pairs) */}
      {/* Left Legs */}
      <Path d="M35 52 Q22 46 16 54" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M33 58 Q18 56 15 65" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M34 64 Q22 66 18 75" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Right Legs */}
      <Path d="M65 52 Q78 46 84 54" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M67 58 Q82 56 85 65" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M66 64 Q78 66 82 75" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Left Claw Arm */}
      <Path d="M36 46 Q24 38 24 30" stroke="#7C3AED" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Left Claw Pincer */}
      <Path d="M22 30 C16 26 14 16 24 18 C28 22 24 28 22 30 Z" fill="#6D28D9" stroke="#4C1D95" strokeWidth="1.2" />
      <Path d="M22 30 C26 26 34 22 30 16 C22 18 20 26 22 30 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="1.2" />

      {/* Right Claw Arm */}
      <Path d="M64 46 Q76 38 76 30" stroke="#7C3AED" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Right Claw Pincer */}
      <Path d="M78 30 C84 26 86 16 76 18 C72 22 76 28 78 30 Z" fill="#6D28D9" stroke="#4C1D95" strokeWidth="1.2" />
      <Path d="M78 30 C74 26 66 22 70 16 C78 18 80 26 78 30 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="1.2" />

      {/* Main Carapace (Oval shell with ridges) */}
      <Ellipse cx="50" cy="58" rx="20" ry="15" fill="url(#crabPurple)" stroke="#4C1D95" strokeWidth="2" />

      {/* Shell ridges / pattern */}
      <Path d="M42 54 Q50 50 58 54" stroke="#A78BFA" strokeWidth="2" fill="none" />
      <Path d="M40 60 Q50 64 60 60" stroke="#A78BFA" strokeWidth="2" fill="none" />

      {/* Eye stalks */}
      <Path d="M44 45 L44 40" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="44" cy="39" r="2.5" fill="#111827" />
      <Circle cx="44.8" cy="38.5" r="0.8" fill="#FFFFFF" />

      <Path d="M56 45 L56 40" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="56" cy="39" r="2.5" fill="#111827" />
      <Circle cx="56.8" cy="38.5" r="0.8" fill="#FFFFFF" />
    </G>
  </Svg>
);

export const FishIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="fishSea" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#38BDF8" />
        <Stop offset="100%" stopColor="#0284C7" />
      </RadialGradient>
      <LinearGradient id="goldFishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FDE047" />
        <Stop offset="60%" stopColor="#F59E0B" />
        <Stop offset="100%" stopColor="#D97706" />
      </LinearGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#fishSea)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Coral at bottom */}
    <Path d="M25 82 Q30 74 34 83" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
    <Path d="M68 83 Q74 72 78 84" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />

    {/* Golden Asian Carp */}
    <G>
      {/* Tail Fin (Caudal) */}
      <Path
        d="M34 50 Q22 34 14 38 Q22 50 14 62 Q22 66 34 52 Z"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="1.2"
      />
      <Path d="M30 50 Q20 42 16 42" stroke="#FEF08A" strokeWidth="1" fill="none" />
      <Path d="M30 51 Q20 58 16 58" stroke="#FEF08A" strokeWidth="1" fill="none" />

      {/* Dorsal Fin (Top) */}
      <Path d="M46 36 Q56 26 64 36 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />

      {/* Pectoral Fin (Bottom) */}
      <Path d="M52 58 Q56 68 48 68 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />

      {/* Main Fish Body */}
      <Path
        d="M32 50 C36 36 60 34 74 44 C82 50 82 54 74 58 C60 68 36 64 32 50 Z"
        fill="url(#goldFishGrad)"
        stroke="#B45309"
        strokeWidth="1.5"
      />

      {/* Scales pattern */}
      <Path d="M48 44 Q52 48 48 52" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
      <Path d="M54 42 Q58 48 54 54" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
      <Path d="M60 44 Q64 48 60 52" stroke="#FBBF24" strokeWidth="1.5" fill="none" />

      {/* Gill cover */}
      <Path d="M66 42 Q64 50 66 56" stroke="#92400E" strokeWidth="1.5" fill="none" />

      {/* Eye */}
      <Circle cx="73" cy="46" r="3" fill="#FFFFFF" stroke="#92400E" strokeWidth="1" />
      <Circle cx="74" cy="46" r="1.5" fill="#111827" />

      {/* Water bubbles */}
      <Circle cx="80" cy="38" r="2" fill="rgba(255,255,255,0.6)" />
      <Circle cx="83" cy="30" r="1.2" fill="rgba(255,255,255,0.7)" />
    </G>
  </Svg>
);

export const DeerIcon: React.FC<IconProps> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <RadialGradient id="deerBg" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FEF3C7" />
        <Stop offset="100%" stopColor="#F59E0B" />
      </RadialGradient>
    </Defs>
    {/* Outer Badge */}
    <Circle cx="50" cy="50" r="46" fill="url(#deerBg)" stroke="#B91C1C" strokeWidth="3" />
    <Circle cx="50" cy="50" r="43" fill="none" stroke="#D97706" strokeWidth="1.5" />

    {/* Deer */}
    <G>
      {/* Antlers */}
      <Path d="M42 32 Q32 18 24 16 M30 20 Q34 16 38 18" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Path d="M58 32 Q68 18 76 16 M70 20 Q66 16 62 18" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Ears */}
      <Path d="M34 36 C24 30 28 42 36 40 Z" fill="#D97706" stroke="#78350F" strokeWidth="1" />
      <Path d="M66 36 C76 30 72 42 64 40 Z" fill="#D97706" stroke="#78350F" strokeWidth="1" />

      {/* Head */}
      <Path
        d="M38 38 C34 50 42 70 50 72 C58 70 66 50 62 38 C58 34 42 34 38 38 Z"
        fill="#B45309"
        stroke="#78350F"
        strokeWidth="1.5"
      />

      {/* Muzzle */}
      <Ellipse cx="50" cy="62" rx="7" ry="6" fill="#FDE68A" />
      <Ellipse cx="50" cy="65" rx="3" ry="2" fill="#1F2937" />

      {/* Eyes */}
      <Ellipse cx="42" cy="46" rx="3" ry="4" fill="#1F2937" />
      <Circle cx="42.5" cy="45" r="1" fill="#FFFFFF" />
      <Ellipse cx="58" cy="46" rx="3" ry="4" fill="#1F2937" />
      <Circle cx="57.5" cy="45" r="1" fill="#FFFFFF" />
    </G>
  </Svg>
);

export const SymbolIconRenderer: React.FC<{ symbolId: SymbolId; size?: number }> = ({
  symbolId,
  size = 64,
}) => {
  switch (symbolId) {
    case 'tiger':
      return <TigerIcon size={size} />;
    case 'calabash':
      return <CalabashIcon size={size} />;
    case 'rooster':
      return <RoosterIcon size={size} />;
    case 'shrimp':
      return <ShrimpIcon size={size} />;
    case 'crab':
      return <CrabIcon size={size} />;
    case 'fish':
      return <FishIcon size={size} />;
    case 'deer':
      return <DeerIcon size={size} />;
    default:
      return <TigerIcon size={size} />;
  }
};
