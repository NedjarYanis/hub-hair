import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 500; // Seuil pour détecter un smartphone

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.webWrapper}>
        <View style={[
          styles.mobileFrame,
          (isMobile || Platform.OS !== 'web') ? styles.fullScreen : styles.pcFrame
        ]}>
          <AppNavigator />
          {/* Barre de navigation iOS uniquement sur PC pour le style */}
          {!isMobile && Platform.OS === 'web' && <View style={styles.homeIndicator} />}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
  },
  pcFrame: {
    width: 402,
    height: 874,
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#1C1C1E',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 120,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 100,
    alignSelf: 'center',
  }
});