import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard, Linking, Platform } from 'react-native';
import { Map } from '../components/Map';
import { GlassContainer } from '../components/GlassContainer';
import { Search, Filter, Star, Navigation, MapPin } from 'lucide-react-native';
import { useBarbers } from '../hooks/useBarbers';
import { MotiView } from 'moti';
import { Barber } from '../types';

// La formule de Haversine pour la distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return (R * c).toFixed(1); 
};

export const DiscoveryScreen = () => {
  const navigation = useNavigation<any>();
  const { barbers, userLoc, loading } = useBarbers();
  
  const [selectedFilter, setFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  
  // NOUVEAU : États pour l'autocomplétion
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Filtrage des barbiers
  useEffect(() => {
    let result = barbers;
    if (selectedFilter === 'Salons') result = barbers.filter(b => !b.isMobile);
    if (selectedFilter === 'À domicile') result = barbers.filter(b => b.isMobile);
    if (selectedFilter === '⭐ 4.5+') result = barbers.filter(b => b.rating && b.rating >= 4.5);
    
    setFilteredBarbers(result);
    if (result.length > 0) setSelectedBarber(result[0]);
  }, [barbers, selectedFilter]);

  // NOUVEAU : Moteur d'autocomplétion avec "Debounce"
  useEffect(() => {
    // Si la recherche est vide ou trop courte, on cache les suggestions
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    // On attend 400ms après la dernière touche tapée pour lancer la recherche (Debounce)
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = searchQuery.toLowerCase().includes("orléans") || searchQuery.toLowerCase().includes("orleans")
          ? searchQuery + ", Loiret, France"
          : searchQuery;

        // On limite à 4 résultats pour ne pas surcharger l'écran
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=4`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Erreur d'autocomplétion:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // NOUVEAU : Quand l'utilisateur clique sur une suggestion de la liste déroulante
  const handleSelectSuggestion = (item: any) => {
    Keyboard.dismiss();
    setSearchQuery(item.name || item.display_name.split(',')[0]); // Garde un nom propre dans la barre
    setSuggestions([]); // Cache la liste déroulante
    
    // Fait voler la carte
    setMapCenter({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    });
  };

  // Fallback : Fonction classique si l'utilisateur appuie directement sur "Entrée"
  const handleManualSearch = async () => {
    if (!searchQuery.trim() || suggestions.length > 0) return;
    Keyboard.dismiss();
    setIsSearching(true);
    try {
      const query = searchQuery.toLowerCase().includes("orléans") || searchQuery.toLowerCase().includes("orleans")
        ? searchQuery + ", Loiret, France"
        : searchQuery;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setMapCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setSuggestions([]);
      } else {
        alert("Adresse introuvable.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkerPress = useCallback((id: string) => {
    const clickedBarber = filteredBarbers.find(b => b.id === id);
    if (clickedBarber) setSelectedBarber(clickedBarber);
  }, [filteredBarbers]);

  const handleNavigation = () => {
    if (!selectedBarber) return;
    const lat = selectedBarber.latitude;
    const lng = selectedBarber.longitude;
    const label = encodeURIComponent(selectedBarber.name);
    let url = '';

    if (Platform.OS === 'web') {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else if (Platform.OS === 'ios') {
      url = `maps://?daddr=${lat},${lng}&q=${label}`;
    } else {
      url = `google.navigation:q=${lat},${lng}`;
    }

    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    });
  };

  const distanceText = useMemo(() => {
    if (!selectedBarber || !userLoc) return "";
    const dist = calculateDistance(userLoc.latitude, userLoc.longitude, selectedBarber.latitude, selectedBarber.longitude);
    return ` • ${dist} km`;
  }, [selectedBarber, userLoc]);

  return (
    <View style={styles.container}>
      <Map 
        barbers={filteredBarbers} 
        centerLat={mapCenter?.lat || userLoc?.latitude} 
        centerLng={mapCenter?.lng || userLoc?.longitude} 
        onMarkerPress={handleMarkerPress}
        userLocation={userLoc}
      />
      
      <View style={styles.topContainer}>
        {/* ENVELOPPE DE LA BARRE ET DES SUGGESTIONS */}
        <View style={{ zIndex: 20 }}>
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
              onSubmitEditing={handleManualSearch}
            />
            <TouchableOpacity onPress={handleManualSearch}>
              <MapPin color={searchQuery ? "#FFF" : "#555"} size={18} />
            </TouchableOpacity>
          </View>

          {/* LA LISTE DÉROULANTE (AUTOCOMPLÉTION) */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.suggestionItem, index === suggestions.length - 1 && { borderBottomWidth: 0 }]} 
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <MapPin color="#888" size={16} style={{marginRight: 12}} />
                  <Text style={styles.suggestionText} numberOfLines={2}>{item.display_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
                      {selectedBarber.rating || "N/A"}{distanceText} • {selectedBarber.price ? `À partir de ${selectedBarber.price}€` : "Prix sur devis"}
                    </Text>
                  </View>
                  <Text style={styles.typeText}>
                    {selectedBarber.isMobile ? "🚗 Se déplace chez vous" : "💈 Salon fixe"}
                  </Text>
                </View>
                
                {/* NOUVELLE ZONE DES BOUTONS */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity style={styles.goBtn} onPress={handleNavigation}>
                    <Navigation color="#FFF" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.goBtn, { backgroundColor: '#4285F4', width: 'auto', paddingHorizontal: 20, borderRadius: 27 }]} 
                    onPress={() => navigation.navigate('BarberProfile', { barberId: selectedBarber.id, barberName: selectedBarber.name })}
                  >
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Réserver</Text>
                  </TouchableOpacity>
                </View>
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
  // NOUVELLES RÈGLES DE STYLE POUR LE MENU DÉROULANT
  suggestionsContainer: {
    position: 'absolute',
    top: 55, // Juste en dessous de la barre de recherche
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginBottom: 15,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  suggestionText: { color: '#CCC', fontSize: 14, flex: 1 },
  // RESTE DES STYLES
  filters: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(20,20,20,0.8)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
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