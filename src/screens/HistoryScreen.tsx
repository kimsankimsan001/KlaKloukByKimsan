import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { HistoryCard } from '../components/HistoryCard';
import { FestiveBunting } from '../components/FestiveBunting';
import { GoldHeader } from '../components/GoldHeader';
import { formatCoins } from '../services/gameLogic';
import { FONTS } from '../constants/theme';

interface Props {
  onBack: () => void;
}

export const HistoryScreen: React.FC<Props> = ({ onBack }) => {
  const { history, stats } = useGameStore();

  const winRate =
    stats.totalRounds > 0
      ? Math.round((stats.roundsWon / stats.totalRounds) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FestiveBunting />

        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>ប្រវត្តិការលេង (HISTORY)</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Stats Summary Bar */}
        <View style={styles.statsSummaryContainer}>
          <View style={styles.statTile}>
            <Text style={styles.statVal}>{stats.totalRounds}</Text>
            <Text style={styles.statTitle}>ROUNDS</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: '#10B981' }]}>{winRate}%</Text>
            <Text style={styles.statTitle}>WIN RATE</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: '#FFD700' }]}>
              +{formatCoins(stats.totalWonAmount)}
            </Text>
            <Text style={styles.statTitle}>TOTAL WON</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statVal, { color: '#F5BA13' }]}>
              +{formatCoins(stats.maxWinSingleRound)}
            </Text>
            <Text style={styles.statTitle}>BEST WIN</Text>
          </View>
        </View>

        {/* Rounds List */}
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎲</Text>
            <Text style={styles.emptyText}>មិនទាន់មានប្រវត្តិលេងនៅឡើយទេ</Text>
            <Text style={styles.emptySub}>No game rounds played yet. Start playing!</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => `round-${item.roundId}-${item.timestamp}`}
            renderItem={({ item }) => <HistoryCard round={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsSummaryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#131F2A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 186, 19, 0.35)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  statTitle: {
    color: '#94A3B8',
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: FONTS.khmerBold,
    color: '#FFE082',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
