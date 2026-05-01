import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ActivityScreen = () => (
  <View style={styles.container}><Text style={styles.text}>Historique & Réservations</Text></View>
);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', fontSize: 18, fontWeight: '600' }
});