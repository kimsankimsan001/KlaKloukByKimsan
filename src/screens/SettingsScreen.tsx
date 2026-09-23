import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { FestiveBunting } from '../components/FestiveBunting';
import { COLORS, FONTS } from '../constants/theme';

interface Props {
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const { settings, updateSettings } = useGameStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FestiveBunting />

        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>ការកំណត់ (SETTINGS)</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Audio Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>សំឡេង (AUDIO & HAPTICS)</Text>

            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>សំឡេងហ្គេម (Sound FX)</Text>
                <Text style={styles.rowSub}>Dice shakes, chip taps, win fanfare</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) => updateSettings({ soundEnabled: val })}
                trackColor={{ false: '#334155', true: '#F5BA13' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>ភ្លេងប្រគុំ (Background Music)</Text>
                <Text style={styles.rowSub}>Khmer ambient casino melody</Text>
              </View>
              <Switch
                value={settings.musicEnabled}
                onValueChange={(val) => updateSettings({ musicEnabled: val })}
                trackColor={{ false: '#334155', true: '#F5BA13' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>រំញ័រទូរស័ព្ទ (Haptic Vibration)</Text>
                <Text style={styles.rowSub}>Tactile roll and bet feedback</Text>
              </View>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={(val) => updateSettings({ hapticEnabled: val })}
                trackColor={{ false: '#334155', true: '#F5BA13' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Symbol Variant Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>រូបសញ្ញាប្រពៃណី (TRADITIONAL SYMBOLS)</Text>
            <Text style={styles.sectionHint}>
              Select whether the board displays the traditional Calabash Gourd (matching reference) or Deer.
            </Text>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.variantBtn,
                  settings.symbolVariant === 'calabash' && styles.variantBtnActive,
                ]}
                onPress={() => updateSettings({ symbolVariant: 'calabash' })}
              >
                <Text style={styles.variantEmoji}>🍶</Text>
                <Text style={styles.variantTitle}>ឃ្លោក (Calabash)</Text>
                <Text style={styles.variantSub}>Reference Standard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.variantBtn,
                  settings.symbolVariant === 'deer' && styles.variantBtnActive,
                ]}
                onPress={() => updateSettings({ symbolVariant: 'deer' })}
              >
                <Text style={styles.variantEmoji}>🦌</Text>
                <Text style={styles.variantTitle}>ក្តាន់ (Deer)</Text>
                <Text style={styles.variantSub}>Classic Variant</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ភាសា (LANGUAGE)</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.variantBtn,
                  settings.language === 'km' && styles.variantBtnActive,
                ]}
                onPress={() => updateSettings({ language: 'km' })}
              >
                <Text style={styles.variantTitle}>ភាសាខ្មែរ</Text>
                <Text style={styles.variantSub}>Khmer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.variantBtn,
                  settings.language === 'en' && styles.variantBtnActive,
                ]}
                onPress={() => updateSettings({ language: 'en' })}
              >
                <Text style={styles.variantTitle}>English</Text>
                <Text style={styles.variantSub}>International</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About Game Info */}

          {/* About Game Info */}
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Kla Klouk by Kimsan (ខ្លាឃ្លោក ភូមិយើង)</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0 • Mobile & Tablet Edition</Text>
            <View style={styles.devBadge}>
              <Text style={styles.devKhmer}>អ្នកបង្កើតកម្មវិធី ៖ លី គីមសាន</Text>
              <Text style={styles.devName}>Developer: Ly Kimsan</Text>
            </View>
            <Text style={styles.aboutText}>
              A professional cross-platform digital simulation of Cambodia's traditional holiday dice game with fair odds and casino-grade animations.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1218',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B1218',
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#F5BA13',
  },
  backArrow: {
    color: '#FFE082',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 4,
    lineHeight: 20,
  },
  backText: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
  },
  screenTitle: {
    color: '#FFE082',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  section: {
    backgroundColor: '#131F2A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 186, 19, 0.3)',
    padding: 14,
    gap: 12,
  },
  sectionHeader: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionHint: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  rowSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  variantBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingVertical: 10,
    alignItems: 'center',
  },
  variantBtnActive: {
    borderColor: '#F5BA13',
    backgroundColor: 'rgba(245, 186, 19, 0.12)',
  },
  variantEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  variantTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  variantSub: {
    color: '#94A3B8',
    fontSize: 9,
    marginTop: 2,
  },
  dangerBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  aboutTitle: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 14,
    fontWeight: '800',
  },
  aboutVersion: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  devBadge: {
    backgroundColor: 'rgba(245, 186, 19, 0.1)',
    borderWidth: 1.2,
    borderColor: '#F5BA13',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
  },
  devKhmer: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  devName: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.8,
  },
  aboutText: {
    color: '#94A3B8',
    fontSize: 10.5,
    textAlign: 'center',
    lineHeight: 15,
    maxWidth: 320,
    marginTop: 4,
  },
});
