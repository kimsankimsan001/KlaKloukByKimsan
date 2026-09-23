import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MultiplayerEntryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const createOnlineRoomAction = useGameStore((state) => state.createOnlineRoomAction);
  const joinOnlineRoomAction = useGameStore((state) => state.joinOnlineRoomAction);

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [name, setName] = useState(playerName || '');
  const [pin, setPin] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [joinPinInput, setJoinPinInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន! (Please enter your name)');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setPlayerName(trimmedName);
      await createOnlineRoomAction(pin.trim());
      setIsProcessing(false);
      onSuccess();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'បរាជ័យក្នុងការបង្កើតបន្ទប់ (Failed to create room)');
    }
  };

  const handleJoinRoom = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន! (Please enter your name)');
      return;
    }

    const trimmedRoomId = roomIdInput.trim();
    if (!trimmedRoomId) {
      setErrorMsg('សូមបញ្ចូលលេខកូដបន្ទប់ ៦ខ្ទង់ (Please enter 6-digit Room ID)');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setPlayerName(trimmedName);
      const res = await joinOnlineRoomAction(trimmedRoomId, joinPinInput.trim());
      setIsProcessing(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'លេខកូដបន្ទប់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'បរាជ័យក្នុងការចូលបន្ទប់');
    }
  };

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
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerIcon}>{mode === 'create' ? '👑' : '🚪'}</Text>
              <Text style={styles.headerKhmer}>
                {mode === 'create' ? 'បង្កើតតុអនឡាញថ្មី' : 'ចូលរួមតុអនឡាញ'}
              </Text>
            </View>
            <Text style={styles.headerEng}>
              {mode === 'create' ? 'CREATE NEW ONLINE TABLE' : 'JOIN ONLINE TABLE'}
            </Text>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Mode Switch Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, mode === 'create' && styles.tabBtnActive]}
                onPress={() => {
                  setMode('create');
                  setErrorMsg(null);
                }}
              >
                <Text
                  style={[styles.tabBtnTxt, mode === 'create' && styles.tabBtnTxtActive]}
                >
                  👑 បង្កើតតុ (CREATE)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, mode === 'join' && styles.tabBtnActive]}
                onPress={() => {
                  setMode('join');
                  setErrorMsg(null);
                }}
              >
                <Text
                  style={[styles.tabBtnTxt, mode === 'join' && styles.tabBtnTxtActive]}
                >
                  🚪 ចូលរួមតុ (JOIN)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTxt}>⚠️ {errorMsg}</Text>
              </View>
            )}

            {/* Player Name Input (Common to both modes) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                ឈ្មោះរបស់អ្នក (YOUR NAME) <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  setErrorMsg(null);
                }}
                placeholder="ឧ. គីមសាន ឬ ចន្ថា..."
                placeholderTextColor="#64748B"
                maxLength={20}
                style={styles.textInput}
              />
            </View>

            {mode === 'create' ? (
              <>
                {/* Table PIN Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    លេខកូដសម្ងាត់តុ PIN (TABLE PASSWORD)
                  </Text>
                  <TextInput
                    value={pin}
                    onChangeText={setPin}
                    placeholder="ឧ. 1234 ឬ 8888 (ទុកនៅទទេបើគ្មាន PIN)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    maxLength={8}
                    style={styles.textInput}
                  />
                  <Text style={styles.helperTxt}>
                    💡 បងអាចដាក់លេខសម្ងាត់ដើម្បីការពារកុំឱ្យអ្នកដទៃចូលផ្ដេសផ្ដាស ឬទុកនៅទទេប្រសិនបើចង់ឱ្យមិត្តភក្តិចូលសេរី។
                  </Text>
                </View>

                {/* Create Table Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, styles.createBtn, isProcessing && styles.btnDisabled]}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                  onPress={handleCreateRoom}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#0F172A" />
                  ) : (
                    <>
                      <Text style={styles.createBtnTxtKhmer}>បង្កើតតុ និងចូលលេង</Text>
                      <Text style={styles.createBtnTxtEng}>CREATE TABLE & PLAY</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Join Mode Inputs */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    លេខកូដបន្ទប់ (ROOM ID) <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <TextInput
                    value={roomIdInput}
                    onChangeText={setRoomIdInput}
                    placeholder="បញ្ចូលលេខបន្ទប់ ៦ខ្ទង់ (ឧ. 482910)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    maxLength={8}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    លេខកូដសម្ងាត់តុ PIN (ប្រសិនបើតុមាន)
                  </Text>
                  <TextInput
                    value={joinPinInput}
                    onChangeText={setJoinPinInput}
                    placeholder="បញ្ចូល PIN របស់តុ (ប្រសិនបើមាន)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    maxLength={8}
                    style={styles.textInput}
                  />
                </View>

                {/* Join Table Submit Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, styles.joinBtn, isProcessing && styles.btnDisabled]}
                  disabled={isProcessing}
                  activeOpacity={0.8}
                  onPress={handleJoinRoom}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.joinBtnTxtKhmer}>ចូលរួមលេងឥឡូវនេះ</Text>
                      <Text style={styles.joinBtnTxtEng}>JOIN TABLE NOW</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Note about Host and Participant Roles */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>📌 ចំណាំស្តីពីការលេងអនឡាញ៖</Text>
              <Text style={styles.infoDesc}>
                • អ្នកបង្កើតតុនឹងក្លាយជា <Text style={{ color: '#FFE082', fontWeight: '800' }}>មេតុ (HOST / DEALER)</Text> ដែលមានសិទ្ធិក្រឡុកគ្រាប់ឡុកឡាក់ និងផ្តល់លុយឱ្យកូនៗ។{'\n'}
                • អ្នកចូលរួមនឹងចាប់ផ្តើមជាមួយលុយ $0 ហើយត្រូវឱ្យមេតុចុចផ្តល់លុយឱ្យទើបអាចចាក់បាន។
              </Text>
            </View>
          </ScrollView>
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
    maxHeight: '90%',
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
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F5BA13',
    position: 'relative',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFE082',
    fontSize: 19,
    fontWeight: '900',
  },
  headerEng: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnTxt: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(245, 186, 19, 0.15)',
    borderColor: '#F5BA13',
  },
  tabBtnTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  tabBtnTxtActive: {
    color: '#FFE082',
  },
  errorBox: {
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorTxt: {
    color: '#FEE2E2',
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#E2E8F0',
    fontSize: 11.5,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  requiredMark: {
    color: '#EF4444',
    fontWeight: '900',
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#475569',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  helperTxt: {
    fontFamily: FONTS.khmerRegular,
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },
  submitBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  createBtn: {
    backgroundColor: '#F5BA13',
    borderColor: '#FFE082',
    borderWidth: 2,
    shadowColor: '#F5BA13',
  },
  createBtnTxtKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#451A03',
    fontSize: 18,
    fontWeight: '900',
  },
  createBtnTxtEng: {
    color: '#78350F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  joinBtn: {
    backgroundColor: '#10B981',
    borderColor: '#6EE7B7',
    borderWidth: 2,
    shadowColor: '#10B981',
  },
  joinBtnTxtKhmer: {
    fontFamily: FONTS.khmerBlack,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  joinBtnTxtEng: {
    color: '#DCFCE7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  infoBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  infoTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3,
  },
  infoDesc: {
    fontFamily: FONTS.khmerRegular,
    color: '#94A3B8',
    fontSize: 10.5,
    lineHeight: 16,
  },
});
