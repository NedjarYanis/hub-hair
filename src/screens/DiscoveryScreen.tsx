import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard, Linking, Platform } from 'react-native';
import { Map } from '../components/Map';
import { GlassContainer } from '../components/GlassContainer';
import { Search, Filter, Star, Navigation, MapPin } from 'lucide-react-native';
import { useBarbers } from '../hooks/useBarbers';
import { MotiView } from 'moti';
import { Barber } from '../types';

export const DiscoveryScreen = () => {
  const { barbers, userLoc, loading } = useBarbers();
  
  const [selectedFilter, setFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  useEffect(() => {
    let result = barbers;
    if (selectedFilter === 'Salons') result = barbers.filter(b => !b.isMobile);
    if (selectedFilter === 'À domicile') result = barbers.filter(b => b.isMobile);
    if (selectedFilter === '⭐ 4.5+') result = barbers.filter(b => b.rating && b.rating >= 4.5);
    
    setFilteredBarbers(result);
    if (result.length > 0) setSelectedBarber(result[0]);
  }, [barbers, selectedFilter]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setIsSearching(true);
    try {
      const query = searchQuery.toLowerCase().includes("orléans") || searchQuery.toLowerCase().includes("orleans")
        ? searchQuery + ", Loiret, France"
        : searchQuery;

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setMapCenter({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      } else {
        alert("Adresse introuvable.");
      }
    } catch (error) {
      console.error("Erreur de géocodage:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkerPress = useCallback((id: string) => {
    const clickedBarber = filteredBarbers.find(b => b.id === id);
    if (clickedBarber) {
      setSelectedBarber(clickedBarber);
    }
  }, [filteredBarbers]);

  // NOUVEAU : Le moteur de redirection GPS "World-Class"
  const handleNavigation = () => {
    if (!selectedBarber) return;

    const lat = selectedBarber.latitude;
    const lng = selectedBarber.longitude;
    const label = encodeURIComponent(selectedBarber.name);

    let url = '';

    if (Platform.OS === 'web') {
      // Sur navigateur, on ouvre le site web de Google Maps avec l'itinéraire
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else if (Platform.OS === 'ios') {
      // Sur iPhone, on lance Apple Maps
      url = `maps://?daddr=${lat},${lng}&q=${label}`;
    } else {
      // Sur Android, on lance l'app Google Maps en mode navigation
      url = `google.navigation:q=${lat},${lng}`;
    }

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Sécurité de secours : si le téléphone n'a pas d'app GPS native, on force la version Web
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Map 
        barbers={filteredBarbers} 
        centerLat={mapCenter?.lat || userLoc?.latitude} 
        centerLng={mapCenter?.lng || userLoc?.longitude} 
        onMarkerPress={handleMarkerPress}
      />
      
      <View style={styles.topContainer}>
        <View style={styles.searchBar}>
          {isSearching ? (
            <ActivityIndicator color="#FFF" size="small" style={{marginRight: 10}} />
          ) : (
            <Search color="#888" size={18} style={{marginRight: 10}} />
          )}
          <TextInput 
            placeholder="Orléans, Saran..." 
            placeholderTextColor="#888" 
            style={styles.input} 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <MapPin color={searchQuery ? "#FFF" : "#555"} size={18} />
          </TouchableOpacity>
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
            from={{ opacity: 0, translateY: 20 }} 
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            key={selectedBarber?.id || 'empty'}
          >
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator color="#FFF" />
              </View>
            ) : selectedBarber ? (
              <View style={styles.barberPreview}>
                <View style={styles.textInfo}>
                  <Text style={styles.barberName} numberOfLines={1}>{selectedBarber.name}</Text>
                  <View style={styles.ratingRow}>
                    <Star color="#F1C40F" size={14} fill="#F1C40F" />
                    <Text style={styles.ratingText}>
                      {selectedBarber.rating || "N/A"} • {selectedBarber.price ? `${selectedBarber.price}€` : "Prix sur devis"}
                    </Text>
                  </View>
                  <Text style={styles.typeText}>
                    {selectedBarber.isMobile ? "🚗 Se déplace chez vous" : "💈 Salon fixe"}
                  </Text>
                </View>
                {/* LE BOUTON EST MAINTENANT CONNECTÉ ICI 👇 */}
                <TouchableOpacity style={styles.goBtn} onPress={handleNavigation}>
                  <Navigation color="#FFF" size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centerBox}>
                <Text style={styles.noData}>Aucun barbier trouvé ici.</Text>
              </View>
            )}
          </MotiView>
        </GlassContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topContainer: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, paddingHorizontal: 20 },
  searchBar: { 
    height: 50, 
    backgroundColor: 'rgba(20, 20, 20, 0.85)', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    marginBottom: 15 
  },
  input: { flex: 1, color: '#FFF', fontWeight: '500', fontSize: 15, marginRight: 10 },
  filters: { flexDirection: 'row' },
  filterChip: { 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: 'rgba(20,20,20,0.8)', 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  activeChip: { backgroundColor: '#FFF', borderColor: '#FFF' },
  filterText: { color: '#AAA', fontWeight: '600', fontSize: 13 },
  activeFilterText: { color: '#000' },
  bottomOverlay: { position: 'absolute', bottom: 105, left: 16, right: 16 },
  barberPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textInfo: { flex: 1, marginRight: 15 },
  barberName: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 4 },
  ratingText: { color: '#E0E0E0', fontSize: 14, marginLeft: 6, fontWeight: '500' },
  typeText: { color: '#888', fontSize: 13 },
  goBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#1F3A93', justifyContent: 'center', alignItems: 'center', shadowColor: '#1F3A93', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: {width: 0, height: 4} },
  centerBox: { height: 60, justifyContent: 'center', alignItems: 'center' },
  noData: { color: '#888', fontSize: 15 }
});