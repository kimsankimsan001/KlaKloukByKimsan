import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useGameStore } from './src/store/gameStore';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AboutModal } from './src/components/AboutModal';

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

  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home'); // Boots into Main Menu per user request!
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('home');
  const [showAbout, setShowAbout] = useState(false);

  const initialize = useGameStore((state) => state.initialize);
  const joinOnlineRoomAction = useGameStore((state) => state.joinOnlineRoomAction);
  const leaveOnlineRoomAction = useGameStore((state) => state.leaveOnlineRoomAction);

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
          setCurrentScreen('game');
        }
      }
    });
  }, [initialize, joinOnlineRoomAction]);

  const navigateTo = (next: ScreenName) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(next);
  };

  const handleStartSinglePlayer = () => {
    // Leave online room if previously joined, to ensure pure single player
    leaveOnlineRoomAction();
    navigateTo('game');
  };

  const handleStartMultiplayer = () => {
    navigateTo('game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartSinglePlayer={handleStartSinglePlayer}
            onStartMultiplayer={handleStartMultiplayer}
            onOpenSettings={() => navigateTo('settings')}
            onOpenAbout={() => setShowAbout(true)}
            onOpenHistory={() => navigateTo('history')}
          />
        );
      case 'game':
        return (
          <GameScreen
            onNavigateHome={() => navigateTo('home')}
            onNavigateHistory={() => navigateTo('history')}
            onNavigateSettings={() => navigateTo('settings')}
          />
        );
      case 'history':
        return <HistoryScreen onBack={() => navigateTo(previousScreen || 'home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => navigateTo(previousScreen || 'home')} />;
      default:
        return (
          <HomeScreen
            onStartSinglePlayer={handleStartSinglePlayer}
            onStartMultiplayer={handleStartMultiplayer}
            onOpenSettings={() => navigateTo('settings')}
            onOpenAbout={() => setShowAbout(true)}
            onOpenHistory={() => navigateTo('history')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
      <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1218',
  },
});
