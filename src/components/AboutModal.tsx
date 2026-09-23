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
import { SymbolIconRenderer } from './AnimalIcons';
import { SymbolId } from '../types';
import { FONTS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ visible, onClose }) => {
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
            <Text style={styles.headerKhmer}>អំពីហ្គេម ខ្លាឃ្លោក</Text>
            <Text style={styles.headerEng}>ABOUT KLA KLOUK BY KIMSAN</Text>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Story & Cultural Context */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>១. ប្រវត្តិល្បែងប្រជាប្រិយ (HERITAGE)</Text>
              <Text style={styles.bodyText}>
                «ខ្លាឃ្លោក» (Kla Klouk) គឺជាល្បែងគ្រាប់ឡុកឡាក់ប្រពៃណីខ្មែរដ៏ពេញនិយមបំផុត ដែលតែងតែលេងកម្សាន្តយ៉ាងគគ្រឹកគគ្រេងក្នុងឱកាសពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ។ ហ្គេមនេះត្រូវបានរៀបចំឡើងជាលក្ខណៈ 2D Animation ដោយរក្សានូវច្បាប់ដើមពិតៗ ១០០%។
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

            {/* Payout System */}
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

            {/* Online Live Casino Roles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>៣. តួនាទីក្នុងតុអនឡាញ (ONLINE ROLES)</Text>
              <View style={styles.roleBox}>
                <Text style={styles.roleTitle}>👑 អ្នកធ្វើមេ (DEALER / HOST):</Text>
                <Text style={styles.roleDesc}>
                  • មេជាអ្នកបង្កើតបន្ទប់ និងមានសិទ្ធិកំណត់លេខកូដ PIN សម្ងាត់តុ។{'\n'}
                  • មេមានសិទ្ធិចុច «ចាប់ផ្តើមក្រឡុក» ដើម្បីក្រឡុកគ្រាប់ឡុកឡាក់ឱ្យកូនៗមើលព្រមគ្នា។{'\n'}
                  • មេមានសិទ្ធិផ្ដល់លុយ (+$1K, +$5K, +$10K, +$50K) ឱ្យកូនៗក្នុងតុ។{'\n'}
                  • <Text style={{ color: '#F5BA13', fontWeight: '900' }}>មេមិនអាចចាក់ភ្នាល់លើក្រឡាសត្វខ្លួនឯងបានទេ</Text> (មេជាអ្នកស៊ីសង)!
                </Text>
              </View>

              <View style={[styles.roleBox, { marginTop: 8 }]}>
                <Text style={styles.roleTitle}>🎲 កូនចាក់ (PLAYERS / GUESTS):</Text>
                <Text style={styles.roleDesc}>
                  • ចូលរួមតុដោយដាក់លេខបន្ទប់ Room ID និង PIN។{'\n'}
                  • ចាប់ផ្តើមជាមួយលុយ $0 (រង់ចាំមេតុផ្ដល់លុយឱ្យលេង)។{'\n'}
                  • ដាក់ប្រាក់ភ្នាល់លើរូបសត្វដែលពេញចិត្ត ហើយរង់ចាំមេក្រឡុកដើម្បីដឹងលទ្ធផល!
                </Text>
              </View>
            </View>

            {/* Fair Random Guarantee */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>៤. ភាពយុត្តិធម៌ (100% PROVABLY FAIR)</Text>
              <Text style={styles.bodyText}>
                រាល់ការក្រឡុកគ្រាប់ឡុកឡាក់ទាំងអស់ គឺប្រើប្រាស់ប្រព័ន្ធ Cryptographic Random Generator ដោយគ្មានការលម្អៀង ឬកំណត់ទុកជាមុនឡើយ។
              </Text>
            </View>

            {/* Developer Credit */}
            <View style={styles.aboutCreditCard}>
              <Text style={styles.creditAppName}>KLA KLOUK BY KIMSAN</Text>
              <Text style={styles.creditVersion}>Version 1.0.0 (Expo SDK 57 / React Native Web)</Text>
              <View style={styles.creditDivider} />
              <Text style={styles.creditAuthorKhmer}>បង្កើតឡើងដោយក្តីស្រឡាញ់ ៖ លី គីមសាន</Text>
              <Text style={styles.creditAuthorEng}>Developed by Ly Kimsan</Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>យល់ព្រម (CLOSE)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 999,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5BA13',
    overflow: 'hidden',
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F5BA13',
  },
  headerKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 20,
    fontWeight: '900',
  },
  headerEng: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  scrollArea: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#F5BA13',
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.3,
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
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  loseRow: {
    borderBottomWidth: 0,
  },
  colLeft: {
    color: '#E2E8F0',
    fontSize: 11.5,
    fontWeight: '600',
  },
  colRight: {
    color: '#10B981',
    fontSize: 11.5,
    fontWeight: '800',
  },
  roleBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.3)',
    borderRadius: 10,
    padding: 10,
  },
  roleTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  roleDesc: {
    fontFamily: FONTS.khmerRegular,
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 18,
  },
  aboutCreditCard: {
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 186, 19, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 186, 19, 0.35)',
  },
  creditAppName: {
    color: '#FFE082',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  creditVersion: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  creditDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(245, 186, 19, 0.3)',
    marginVertical: 8,
  },
  creditAuthorKhmer: {
    fontFamily: FONTS.khmerBold,
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
  },
  creditAuthorEng: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  closeBtn: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: '#F5BA13',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#F5BA13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  closeBtnText: {
    color: '#451A03',
    fontSize: 13,
    fontWeight: '900',
  },
});
