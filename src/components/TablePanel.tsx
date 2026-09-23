import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Share,
  Platform,
  TextInput,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import { formatCoins } from '../services/gameLogic';
import { ALL_SYMBOLS } from '../constants/symbols';
import { SymbolId } from '../types';

interface Props {
  isCompact?: boolean;
}

export const TablePanel: React.FC<Props> = ({ isCompact = false }) => {
  const roomId = useGameStore((state) => state.roomId);
  const roomPin = useGameStore((state) => state.roomPin);
  const tablePlayers = useGameStore((state) => state.tablePlayers);
  const onlinePlayers = useGameStore((state) => state.onlinePlayers);
  const isOnline = useGameStore((state) => state.isOnline);
  const isHost = useGameStore((state) => state.isHost);
  const playerId = useGameStore((state) => state.playerId);
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const updatePlayerNameAction = useGameStore((state) => state.updatePlayerNameAction);
  const giveCoinsAction = useGameStore((state) => state.giveCoinsAction);

  const createOnlineRoomAction = useGameStore((state) => state.createOnlineRoomAction);
  const joinOnlineRoomAction = useGameStore((state) => state.joinOnlineRoomAction);
  const leaveOnlineRoomAction = useGameStore((state) => state.leaveOnlineRoomAction);

  const [onlineModalVisible, setOnlineModalVisible] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinPinInput, setJoinPinInput] = useState('');
  const [createPinInput, setCreatePinInput] = useState('');
  const [editingName, setEditingName] = useState(playerName);
  const [actionError, setActionError] = useState<string | null>(null);
  const [grantSuccessNotice, setGrantSuccessNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const hasFirebase = isFirebaseConfigured();

  const handleInvite = async () => {
    try {
      const inviteUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/?room=${roomId}`
          : `Room ID: ${roomId}`;
      const pinMsg = roomPin ? ` | លេខសំងាត់ PIN: ${roomPin}` : '';
      const message = `ចូលលេងខ្លាឃ្លោកជាមួយខ្ញុំ! បន្ទប់លេខ (Room ID): ${roomId}${pinMsg}\n${inviteUrl}`;

      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
      } else {
        await Share.share({
          message,
          title: 'Kla Klouk by Kimsan Room Invite',
        });
      }
    } catch {}
  };

  const handleCreateRoom = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const name = editingName.trim() || 'Ly Kimsan';
      setPlayerName(name);
      await createOnlineRoomAction(createPinInput.trim());
      setCopiedNotice(false);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to create room');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinRoom = async () => {
    const code = joinCodeInput.trim();
    if (!code) {
      setActionError('សូមបញ្ចូលលេខកូដបន្ទប់ (Please enter Room ID)');
      return;
    }
    const name = editingName.trim();
    if (!name) {
      setActionError('សូមបញ្ចូលឈ្មោះរបស់អ្នកជាមុនសិន! (Please enter your name first!)');
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    try {
      setPlayerName(name);
      const res = await joinOnlineRoomAction(code, joinPinInput.trim());
      if (!res.success) {
        setActionError(res.error || 'Failed to join room');
      } else {
        setJoinCodeInput('');
        setJoinPinInput('');
      }
    } catch (e: any) {
      setActionError(e?.message || 'Error joining room');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveName = async () => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await updatePlayerNameAction(name);
      setActionError(null);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to update name');
    }
  };

  const handleGiveCoins = async (
    targetPlayerId: string,
    targetPlayerName: string,
    amount: number
  ) => {
    try {
      await giveCoinsAction(targetPlayerId, amount);
      setGrantSuccessNotice(`បានផ្តល់ $${formatCoins(amount)} ដល់ ${targetPlayerName}!`);
      setTimeout(() => setGrantSuccessNotice(null), 2500);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to give coins');
    }
  };

  const handleLeaveRoom = async () => {
    setIsProcessing(true);
    try {
      await leaveOnlineRoomAction();
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => (
    <View style={styles.cardContainer}>
      {/* Header: Room ID & Invite Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.idBadge}
          activeOpacity={0.8}
          onPress={() => setOnlineModalVisible(true)}
        >
          <Text style={styles.idText}>ID : {roomId}</Text>
          <Text style={styles.onlineStatusText}>
            {isOnline ? (isHost ? '👑 HOST' : '🟢 GUEST') : '⚙️ LOBBY'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inviteButton}
          activeOpacity={0.7}
          onPress={handleInvite}
        >
          <Text style={styles.inviteText}>
            {copiedNotice ? 'COPIED!' : 'INVITE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Player Slots */}
      <View style={styles.playerSlotsContainer}>
        {tablePlayers.map((player, idx) => (
          <View key={idx} style={styles.playerSlot}>
            <View style={styles.activeDot} />
            <Text style={styles.slotText} numberOfLines={1}>
              {player} {idx === 0 && isOnline && isHost ? '👑' : 'JOINED'}
            </Text>
          </View>
        ))}
        {Array.from({ length: Math.max(0, 6 - tablePlayers.length) }).map((_, idx) => (
          <View key={`empty-${idx}`} style={[styles.playerSlot, styles.emptySlot]}>
            <Text style={styles.emptySlotText}>WAITING PLAYER...</Text>
          </View>
        ))}
      </View>

      {/* Online Lobby Trigger Button */}
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.7}
        onPress={() => setOnlineModalVisible(true)}
      >
        <Text style={styles.startBtnText}>
          {isOnline ? 'ROOM SETTINGS' : 'MULTIPLAYER'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {isCompact ? (
        <TouchableOpacity
          style={styles.compactTrigger}
          activeOpacity={0.8}
          onPress={() => setOnlineModalVisible(true)}
        >
          <Text style={styles.compactTriggerText}>
            {isOnline ? (isHost ? '👑' : '🟢') : '🎲'} #{roomId}
          </Text>
          <View style={styles.compactPlayerCount}>
            <Text style={styles.compactCountText}>{tablePlayers.length}/6</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidebarWrapper}>{renderContent()}</View>
      )}

      {/* Full Online Multiplayer Manager Modal */}
      <Modal
        visible={onlineModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOnlineModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.multiplayerCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>បន្ទប់លេងអនឡាញ (MULTIPLAYER)</Text>
              <TouchableOpacity
                style={styles.closeHeaderBtn}
                onPress={() => setOnlineModalVisible(false)}
              >
                <Text style={styles.closeHeaderTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Firebase Connection Status Banner */}
              <View
                style={[
                  styles.statusBanner,
                  hasFirebase ? styles.statusBannerOnline : styles.statusBannerLocal,
                ]}
              >
                <Text style={styles.statusBannerIcon}>{hasFirebase ? '⚡' : '🎮'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statusBannerTitle}>
                    {hasFirebase
                      ? 'Firebase Realtime Database: CONNECTED'
                      : 'Mock Multiplayer: READY'}
                  </Text>
                  <Text style={styles.statusBannerSub}>
                    {hasFirebase
                      ? 'Global synchronized dice rolls & live player bets active.'
                      : 'To connect live Firebase, paste keys into src/services/firebaseConfig.ts'}
                  </Text>
                </View>
              </View>

              {/* Player Name Input (Required) */}
              <View style={styles.inputGroup}>
                <View style={styles.nameHeaderRow}>
                  <Text style={styles.inputLabel}>
                    ឈ្មោះរបស់អ្នក (YOUR NAME) <Text style={styles.requiredStar}>*</Text>:
                  </Text>
                  {isOnline && (
                    <TouchableOpacity onPress={handleSaveName} style={styles.saveNameBtn}>
                      <Text style={styles.saveNameTxt}>រក្សាទុក (SAVE)</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  value={editingName}
                  onChangeText={setEditingName}
                  onBlur={handleSaveName}
                  placeholder="បញ្ចូលឈ្មោះរបស់អ្នក (Enter your name)"
                  placeholderTextColor="#64748B"
                  style={styles.textInput}
                />
              </View>

              {/* Room ID & Live Info */}
              <View style={styles.roomInfoBox}>
                <Text style={styles.roomInfoLabel}>លេខកូដបន្ទប់បច្ចុប្បន្ន (CURRENT ROOM ID):</Text>
                <Text style={styles.roomInfoCode}>{roomId}</Text>
                {roomPin ? (
                  <View style={styles.pinBadge}>
                    <Text style={styles.pinBadgeTxt}>🔒 លេខសម្ងាត់ PIN: {roomPin}</Text>
                  </View>
                ) : null}
                <TouchableOpacity style={styles.copyLinkBtn} onPress={handleInvite}>
                  <Text style={styles.copyLinkTxt}>
                    {copiedNotice ? '✓ បានចម្លងរួចរាល់ (COPIED)' : '🔗 ចម្លងតំណភ្ជាប់ (COPY INVITE LINK)'}
                  </Text>
                </TouchableOpacity>
              </View>

              {actionError && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{actionError}</Text>
                </View>
              )}

              {/* Host Money Grant Notification */}
              {grantSuccessNotice && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>✓ {grantSuccessNotice}</Text>
                </View>
              )}

              {/* Participant Zero Balance Notice */}
              {isOnline && !isHost && (
                <View style={styles.guestNoticeBox}>
                  <Text style={styles.guestNoticeTxt}>
                    💡 អ្នកលេងចាប់ផ្តើមជាមួយលុយ $0។ សូមឱ្យមេតុ (Host) ផ្តល់លុយឱ្យអ្នកលេង!
                  </Text>
                </View>
              )}

              {/* Room Actions */}
              <View style={styles.actionButtonsCol}>
                {/* Create Room Section with PIN */}
                <View style={styles.createRoomCard}>
                  <Text style={styles.actionSectionTitle}>👑 បង្កើតបន្ទប់ថ្មី (CREATE TABLE)</Text>
                  <TextInput
                    value={createPinInput}
                    onChangeText={setCreatePinInput}
                    placeholder="ដាក់លេខកូដសម្ងាត់តុ PIN (Optional)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    maxLength={8}
                    style={[styles.textInput, { marginBottom: 8 }]}
                  />
                  <TouchableOpacity
                    style={[styles.primaryActionBtn, isProcessing && styles.btnDisabled]}
                    disabled={isProcessing}
                    onPress={handleCreateRoom}
                  >
                    <Text style={styles.primaryActionTxt}>
                      បង្កើតបន្ទប់ឥឡូវនេះ (CREATE)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Join Room Section with PIN */}
                <View style={styles.joinRoomCard}>
                  <Text style={styles.actionSectionTitle}>🚪 ចូលរួមបន្ទប់មិត្តភក្តិ (JOIN TABLE)</Text>
                  <TextInput
                    value={joinCodeInput}
                    onChangeText={setJoinCodeInput}
                    placeholder="បញ្ចូលលេខកូដបន្ទប់ (6-digit Room ID)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    style={[styles.textInput, { marginBottom: 8 }]}
                  />
                  <TextInput
                    value={joinPinInput}
                    onChangeText={setJoinPinInput}
                    placeholder="លេខកូដសម្ងាត់ PIN (ប្រសិនបើតុមានដាក់)"
                    placeholderTextColor="#64748B"
                    keyboardType="number-pad"
                    maxLength={8}
                    style={[styles.textInput, { marginBottom: 8 }]}
                  />
                  <TouchableOpacity
                    style={[styles.joinBtn, isProcessing && styles.btnDisabled]}
                    disabled={isProcessing}
                    onPress={handleJoinRoom}
                  >
                    <Text style={styles.joinBtnTxt}>ចូលរួមលេង (JOIN TABLE)</Text>
                  </TouchableOpacity>
                </View>

                {isOnline && (
                  <TouchableOpacity
                    style={styles.leaveBtn}
                    onPress={handleLeaveRoom}
                  >
                    <Text style={styles.leaveBtnTxt}>ចាកចេញពីបន្ទប់ (LEAVE ONLINE ROOM)</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Connected Players List with Host Financial Grants */}
              <View style={styles.connectedSection}>
                <Text style={styles.connectedTitle}>
                  អ្នកលេងនៅក្នុងតុ ({onlinePlayers.length || tablePlayers.length}/6 PLAYERS):
                </Text>
                <View style={styles.playersList}>
                  {onlinePlayers.length > 0 ? (
                    onlinePlayers.map((p) => {
                      const isMe = p.id === playerId;
                      const isPlayerHost = p.isHost;

                      return (
                        <View key={p.id} style={styles.playerCardItem}>
                          <View style={styles.playerCardTop}>
                            <View style={styles.activeDot} />
                            <Text style={styles.playerAvatarIcon}>{p.avatar || '🎲'}</Text>
                            <Text style={styles.playerListName} numberOfLines={1}>
                              {p.name} {isMe ? '(You)' : ''}
                            </Text>
                            {isPlayerHost ? (
                              <View style={styles.hostBadge}>
                                <Text style={styles.hostBadgeTxt}>HOST 👑</Text>
                              </View>
                            ) : null}
                            <Text style={styles.playerBalanceAmount}>
                              ${formatCoins(p.balance || 0)}
                            </Text>
                          </View>

                          {/* Player Active Bets Row */}
                          {p.bets && Object.values(p.bets).some((v) => v > 0) && (
                            <View style={styles.playerBetsListRow}>
                              <Text style={styles.playerBetsListLabel}>ចាក់៖</Text>
                              {Object.entries(p.bets)
                                .filter(([_, amt]) => amt && amt > 0)
                                .map(([symId, amt]) => {
                                  const symDef = ALL_SYMBOLS[symId as SymbolId];
                                  return (
                                    <View key={symId} style={styles.playerBetChipTag}>
                                      <Text style={styles.playerBetChipSymbol}>
                                        {symDef?.nameKhmer || symId}:
                                      </Text>
                                      <Text style={styles.playerBetChipAmount}>
                                        ${formatCoins(amt)}
                                      </Text>
                                    </View>
                                  );
                                })}
                            </View>
                          )}

                          {/* Host Coin Grant Controls */}
                          {isHost && !isPlayerHost ? (
                            <View style={styles.grantCoinsRow}>
                              <Text style={styles.grantCoinsLabel}>ផ្តល់លុយ៖</Text>
                              {[1000, 5000, 10000, 50000].map((amt) => (
                                <TouchableOpacity
                                  key={amt}
                                  style={styles.grantCoinBtn}
                                  onPress={() => handleGiveCoins(p.id, p.name, amt)}
                                >
                                  <Text style={styles.grantCoinBtnTxt}>
                                    +${amt >= 1000 ? `${amt / 1000}K` : amt}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      );
                    })
                  ) : (
                    tablePlayers.map((name, i) => (
                      <View key={i} style={styles.playerListItem}>
                        <View style={styles.activeDot} />
                        <Text style={styles.playerListName}>{name}</Text>
                        {i === 0 && isHost && (
                          <View style={styles.hostBadge}>
                            <Text style={styles.hostBadgeTxt}>HOST 👑</Text>
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setOnlineModalVisible(false)}
            >
              <Text style={styles.doneBtnTxt}>រួចរាល់ (DONE)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sidebarWrapper: {
    width: 170,
    zIndex: 12,
  },
  cardContainer: {
    backgroundColor: 'rgba(10, 15, 20, 0.92)',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  idBadge: {
    flex: 1.2,
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 186, 19, 0.08)',
  },
  idText: {
    color: '#F5BA13',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  onlineStatusText: {
    color: '#10B981',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
  },
  inviteButton: {
    flex: 0.9,
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 186, 19, 0.15)',
  },
  inviteText: {
    color: '#FFE082',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  playerSlotsContainer: {
    gap: 5,
    marginBottom: 10,
  },
  playerSlot: {
    borderWidth: 1,
    borderColor: '#8A6818',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(20, 30, 40, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptySlot: {
    borderColor: 'rgba(138, 104, 24, 0.4)',
    backgroundColor: 'rgba(15, 20, 25, 0.5)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  slotText: {
    color: '#F5BA13',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptySlotText: {
    color: 'rgba(245, 186, 19, 0.4)',
    fontSize: 8.5,
    fontStyle: 'italic',
  },
  startButton: {
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 4,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 186, 19, 0.12)',
  },
  startBtnText: {
    color: '#F5BA13',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.8,
  },

  // Compact floating button for mobile phones
  compactTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 20, 28, 0.92)',
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    zIndex: 15,
  },
  compactTriggerText: {
    color: '#F5BA13',
    fontSize: 11,
    fontWeight: '800',
  },
  compactPlayerCount: {
    backgroundColor: 'rgba(245, 186, 19, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  compactCountText: {
    color: '#FFE082',
    fontSize: 9.5,
    fontWeight: '700',
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  multiplayerCard: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F5BA13',
    padding: 18,
    shadowColor: '#F5BA13',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 186, 19, 0.2)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#F5BA13',
    fontSize: 15,
    fontWeight: '900',
  },
  closeHeaderBtn: {
    padding: 4,
  },
  closeHeaderTxt: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    gap: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBannerOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  statusBannerLocal: {
    backgroundColor: 'rgba(245, 186, 19, 0.08)',
    borderColor: '#F5BA13',
  },
  statusBannerIcon: {
    fontSize: 22,
  },
  statusBannerTitle: {
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBannerSub: {
    color: '#94A3B8',
    fontSize: 9,
    marginTop: 2,
    lineHeight: 13,
  },
  inputGroup: {
    gap: 4,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  requiredStar: {
    color: '#EF4444',
  },
  saveNameBtn: {
    backgroundColor: 'rgba(245, 186, 19, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveNameTxt: {
    color: '#FFE082',
    fontSize: 9,
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  roomInfoBox: {
    backgroundColor: 'rgba(245, 186, 19, 0.07)',
    borderWidth: 1.5,
    borderColor: '#F5BA13',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  roomInfoLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11,
    fontWeight: '700',
  },
  roomInfoCode: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  pinBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pinBadgeTxt: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
  },
  copyLinkBtn: {
    backgroundColor: 'rgba(245, 186, 19, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  copyLinkTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 10.5,
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 11,
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  successText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  guestNoticeBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  guestNoticeTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#93C5FD',
    fontSize: 10.5,
    textAlign: 'center',
  },
  actionButtonsCol: {
    gap: 10,
  },
  createRoomCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    padding: 10,
    gap: 6,
  },
  joinRoomCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    padding: 10,
    gap: 6,
  },
  actionSectionTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 11.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  primaryActionBtn: {
    backgroundColor: '#F5BA13',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '900',
  },
  joinBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinBtnTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
  },
  leaveBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveBtnTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  connectedSection: {
    marginTop: 4,
    gap: 6,
  },
  connectedTitle: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  playersList: {
    gap: 8,
  },
  playerCardItem: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  playerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatarIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  playerListName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  playerBalanceAmount: {
    color: '#FFE082',
    fontSize: 12,
    fontWeight: '800',
  },
  playerBetsListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 4,
    borderRadius: 6,
  },
  playerBetsListLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 9.5,
  },
  playerBetChipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  playerBetChipSymbol: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 9,
  },
  playerBetChipAmount: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '800',
  },
  grantCoinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 6,
  },
  grantCoinsLabel: {
    fontFamily: FONTS.khmerBold,
    color: '#94A3B8',
    fontSize: 9.5,
    marginRight: 2,
  },
  grantCoinBtn: {
    backgroundColor: 'rgba(245, 186, 19, 0.15)',
    borderColor: '#F5BA13',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  grantCoinBtnTxt: {
    color: '#FFE082',
    fontSize: 9.5,
    fontWeight: '800',
  },
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  hostBadge: {
    backgroundColor: 'rgba(245, 186, 19, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  hostBadgeTxt: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '900',
  },
  doneBtn: {
    marginTop: 12,
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneBtnTxt: {
    fontFamily: FONTS.khmerBold,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
