import React from 'react';
import { StyleSheet, View, Text, TextInput, Platform } from 'react-native';
import { Map } from '../components/Map';
import { GlassContainer } from '../components/GlassContainer';
import { Search } from 'lucide-react-native';

export const DiscoveryScreen = () => {
  return (
    <View style={styles.container}>
      <Map barbers={[]} />
      
      {/* Barre de recherche flottante haute */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchBar}>
          <Search color="#888" size={20} style={{marginRight: 12}} />
          <TextInput 
            placeholder="Trouver un barbier ou un salon..." 
            placeholderTextColor="#888" 
            style={styles.input} 
          />
        </View>
      </View>

      {/* Carte d'information basse */}
      <View style={styles.bottomOverlay}>
        <GlassContainer>
          <View style={styles.handle} />
          <Text style={styles.title}>À proximité</Text>
          <Text style={styles.subtitle}>Découvrez les meilleurs talents autour de vous.</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Salons</Text>
            </View>
            <View style={[styles.stat, { borderLeftWidth: 1, borderLeftColor: '#333', borderRightWidth: 1, borderRightColor: '#333' }]}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Indépendants</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Note moyenne</Text>
            </View>
          </View>
        </GlassContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  searchOverlay: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20 },
  searchBar: { 
    height: 54, 
    backgroundColor: '#FFF', 
    borderRadius: 100, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: '#000' },
  bottomOverlay: { position: 'absolute', bottom: 100, left: 16, right: 16 },
  handle: { width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { color: '#FFF', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#555', fontSize: 12, textTransform: 'uppercase', marginTop: 2 }
});