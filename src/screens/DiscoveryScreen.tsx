import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Map } from '../components/Map';
import { GlassContainer } from '../components/GlassContainer';
import { Search, Filter, Star, Navigation } from 'lucide-react-native';
import { useBarbers } from '../hooks/useBarbers';
import { MotiView } from 'moti';

export const DiscoveryScreen = () => {
  const { barbers, userLoc, loading } = useBarbers();
  const [selectedFilter, setFilter] = useState('Tous');

  return (
    <View style={styles.container}>
      <Map barbers={barbers} userLoc={userLoc} />
      
      <View style={styles.topContainer}>
        <View style={styles.searchBar}>
          <Search color="#888" size={18} />
          <TextInput placeholder="Orléans, France" placeholderTextColor="#888" style={styles.input} />
          <Filter color="#000" size={18} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {['Tous', 'Salons', 'À domicile', '⭐ 4.5+'].map((f) => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              style={[styles.filterChip, selectedFilter === f && styles.activeChip]}
            >
              <Text style={[styles.filterText, selectedFilter === f && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomOverlay}>
        <GlassContainer>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <View style={styles.barberPreview}>
              <View style={styles.textInfo}>
                <Text style={styles.barberName}>The Heritage Barbershop</Text>
                <View style={styles.ratingRow}>
                  <Star color="#F1C40F" size={14} fill="#F1C40F" />
                  <Text style={styles.ratingText}>4.9 (124 avis) • 1.2 km</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.goBtn}>
                <Navigation color="#FFF" size={24} />
              </TouchableOpacity>
            </View>
          </MotiView>
        </GlassContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topContainer: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, paddingHorizontal: 20 },
  searchBar: { height: 50, backgroundColor: '#FFF', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  input: { flex: 1, marginHorizontal: 10, fontWeight: '600', fontSize: 14 },
  filters: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  activeChip: { backgroundColor: '#FFF' },
  filterText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  activeFilterText: { color: '#000' },
  bottomOverlay: { position: 'absolute', bottom: 105, left: 16, right: 16 },
  barberPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textInfo: { flex: 1 },
  barberName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { color: '#888', fontSize: 13, marginLeft: 6 },
  goBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1F3A93', justifyContent: 'center', alignItems: 'center' }
});