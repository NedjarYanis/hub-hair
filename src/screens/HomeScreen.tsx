import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { GlassContainer } from '../components/GlassContainer';
import { Map } from '../components/Map';
import { Barber } from '../types';

const MOCK_BARBERS: Barber[] = [
  { id: '1', name: 'Barber Street', isMobile: false, latitude: 48.8566, longitude: 2.3522 },
  { id: '2', name: 'Julien (À domicile)', isMobile: true, latitude: 48.8606, longitude: 2.3322 },
];

export const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Le composant Map choisira tout seul Map.tsx (mobile) ou Map.web.tsx (web) */}
      <Map barbers={MOCK_BARBERS} />

      <View style={styles.overlay}>
        <GlassContainer style={styles.searchCard}>
          <Text style={styles.title}>Trouver un coiffeur</Text>
          <Text style={styles.subtitle}>Salons ou à domicile, autour de vous.</Text>
        </GlassContainer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  searchCard: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  }
});