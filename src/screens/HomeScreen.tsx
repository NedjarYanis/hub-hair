import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import { Search, MapPin, Navigation, User } from 'lucide-react-native';
import { GlassContainer } from '../components/GlassContainer';
import { Map } from '../components/Map';

export const HomeScreen: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Map barbers={[]} />

      {/* Barre de recherche flottante style Uber */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileBtn}>
          <User color="#FFF" size={20} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color="#888" size={18} style={{marginRight: 10}} />
          <TextInput 
            placeholder="Où allez-vous ?" 
            placeholderTextColor="#888" 
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Section de sélection rapide */}
      <View style={styles.bottomOverlay}>
        <GlassContainer>
          <View style={styles.handle} />
          <Text style={styles.heroTitle}>Prêt pour votre coupe ?</Text>
          
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.iconContainer}>
              <MapPin color="#FFF" size={20} />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.optionTitle}>Salon Barber Street</Text>
              <Text style={styles.optionSub}>4.9 km • Ouvert</Text>
            </View>
            <Text style={styles.priceText}>25€</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Navigation color="#000" size={20} style={{marginRight: 8}} />
            <Text style={styles.primaryBtnText}>Réserver maintenant</Text>
          </TouchableOpacity>
        </GlassContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  profileBtn: {
    width: 45,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  searchInput: { flex: 1, fontWeight: '500', fontSize: 15 },
  bottomOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 12,
    right: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1F3A93',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textColumn: { flex: 1 },
  optionTitle: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  optionSub: { color: '#888', fontSize: 13, marginTop: 2 },
  priceText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  primaryBtn: {
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});