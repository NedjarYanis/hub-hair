import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.webWrapper}>
        <View style={styles.mobileFrame}>
          <AppNavigator />
          {/* Indicateur de home bar style iOS */}
          <View style={styles.homeIndicator} />
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
    flex: 1,
    width: '100%',
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      maxWidth: 402,
      maxHeight: 874,
      borderRadius: 44,
      borderWidth: 10,
      borderColor: '#1C1C1E',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    } : {})
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 120,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 100,
  }
});