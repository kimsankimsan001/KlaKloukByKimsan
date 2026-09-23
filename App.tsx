import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useGameStore } from './src/store/gameStore';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RulesModal } from './src/screens/RulesModal';

import {
  useFonts,
  Hanuman_400Regular,
  Hanuman_700Bold,
  Hanuman_900Black,
} from '@expo-google-fonts/hanuman';

type ScreenName = 'home' | 'game' | 'history' | 'settings';

export default function App() {
  const [fontsLoaded] = useFonts({
    Hanuman_400Regular,
    Hanuman_700Bold,
    Hanuman_900Black,
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenName>('game'); // Defaults directly to table matching reference
  const [showRules, setShowRules] = useState(false);

  const initialize = useGameStore((state) => state.initialize);
  const joinOnlineRoomAction = useGameStore((state) => state.joinOnlineRoomAction);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Kla Klouk by Kimsan';
    }
    initialize().then(() => {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        if (roomParam) {
          joinOnlineRoomAction(roomParam);
        }
      }
    });
  }, [initialize, joinOnlineRoomAction]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartGame={() => setCurrentScreen('game')}
            onOpenHistory={() => setCurrentScreen('history')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenRules={() => setShowRules(true)}
          />
        );
      case 'game':
        return (
          <GameScreen
            onNavigateHome={() => setCurrentScreen('home')}
            onNavigateHistory={() => setCurrentScreen('history')}
            onNavigateSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'history':
        return <HistoryScreen onBack={() => setCurrentScreen('game')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('game')} />;
      default:
        return (
          <GameScreen
            onNavigateHome={() => setCurrentScreen('home')}
            onNavigateHistory={() => setCurrentScreen('history')}
            onNavigateSettings={() => setCurrentScreen('settings')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
      <RulesModal visible={showRules} onClose={() => setShowRules(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1218',
  },
});
