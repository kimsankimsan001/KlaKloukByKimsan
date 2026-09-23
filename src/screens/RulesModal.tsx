import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ALL_SYMBOLS } from '../constants/symbols';
import { SymbolIconRenderer } from '../components/AnimalIcons';
import { SymbolId } from '../types';
import { FONTS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerKhmer}>របៀបលេង ខ្លាឃ្លោក</Text>
            <Text style={styles.headerEng}>HOW TO PLAY KLA KLOUK</Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>១. ក្បួនលេងទូទៅ (GAME OVERVIEW)</Text>
              <Text style={styles.bodyText}>
                ហ្គេមខ្លាឃ្លោក ប្រើប្រាស់គ្រាប់ឡុកឡាក់ចំនួន ៣ គ្រាប់ ដែលមានរូបសញ្ញាចំនួន ៦៖
              </Text>
              <View style={styles.symbolsGrid}>
                {['tiger', 'calabash', 'rooster', 'shrimp', 'crab', 'fish'].map((id) => {
                  const symId = id as SymbolId;
                  const s = ALL_SYMBOLS[symId];
                  return (
                    <View key={id} style={styles.symbolPill}>
                      <SymbolIconRenderer symbolId={symId} size={28} />
                      <Text style={styles.symbolPillText}>{s?.nameKhmer}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Payout Table */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>២. រង្វាន់ឈ្នះ (PAYOUT SYSTEM)</Text>
              <View style={styles.payoutTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.colLeft}>ត្រូវ ១ គ្រាប់ (1 Match):</Text>
                  <Text style={styles.colRight}>ឈ្នះ ១ ដង (+1x Net Win)</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.colLeft}>ត្រូវ ២ គ្រាប់ (2 Matches):</Text>
                  <Text style={styles.colRight}>ឈ្នះ ២ ដង (+2x Net Win)</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.colLeft}>ត្រូវ ៣ គ្រាប់ (3 Matches):</Text>
                  <Text style={styles.colRight}>ឈ្នះ ៣ ដង (+3x Net Win)</Text>
                </View>
                <View style={[styles.tableRow, styles.loseRow]}>
                  <Text style={styles.colLeft}>មិនត្រូវ (0 Matches):</Text>
                  <Text style={[styles.colRight, { color: '#EF4444' }]}>ចាញ់ប្រាក់ភ្នាល់ (Lose Bet)</Text>
                </View>
              </View>
            </View>

            {/* Example */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>៣. ឧទាហរណ៍ជាក់ស្តែង (EXAMPLE)</Text>
              <Text style={styles.bodyText}>
                • អ្នកចាក់ <Text style={{ color: '#FFE082' }}>មាន់ 100</Text> និង{' '}
                <Text style={{ color: '#FFE082' }}>ត្រី 50</Text>{'\n'}
                • លទ្ធផលឡុកឡាក់ចេញ៖ <Text style={{ color: '#10B981' }}>មាន់ | មាន់ | ក្តាម</Text>{'\n'}
                • មាន់ចេញ ២ ដង៖ ឈ្នះ 100 x 2 = +200 coins{'\n'}
                • ត្រីមិនចេញ៖ ចាញ់ 50 coins{'\n'}
                • សរុបទទួលបាន៖ 300 coins ត្រលប់មកកាបូបវិញ (ចំណេញសុទ្ធ +150 coins)!
              </Text>
            </View>

            {/* Developer Credit */}
            <View style={styles.rulesCreditBox}>
              <Text style={styles.rulesCreditKhmer}>បង្កើតឡើងដោយ ៖ លី គីមសាន (Ly Kimsan)</Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>យល់ព្រម (GOT IT)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F5BA13',
    overflow: 'hidden',
    paddingBottom: 16,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F5BA13',
  },
  headerKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 18,
    fontWeight: '900',
  },
  headerEng: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  scrollArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#F5BA13',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  bodyText: {
    fontFamily: FONTS.khmerRegular,
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 20,
  },
  symbolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  symbolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.3)',
  },
  symbolPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  payoutTable: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  loseRow: {
    borderBottomWidth: 0,
  },
  colLeft: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  colRight: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#F5BA13',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#451A03',
    fontSize: 13,
    fontWeight: '900',
  },
  rulesCreditBox: {
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 186, 19, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.25)',
  },
  rulesCreditKhmer: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
