import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AccountScreen = () => (
  <View style={styles.container}><Text style={styles.text}>Profil & Paramètres</Text></View>
);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFF', fontSize: 18, fontWeight: '600' }
});