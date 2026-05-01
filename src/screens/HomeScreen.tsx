import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GlassContainer } from '../components/GlassContainer';
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
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {MOCK_BARBERS.map((barber) => (
          <Marker
            key={barber.id}
            coordinate={{ latitude: barber.latitude, longitude: barber.longitude }}
            title={barber.name}
            description={barber.isMobile ? "Coiffeur mobile" : "Salon fixe"}
            pinColor={barber.isMobile ? '#EF4135' : '#0055A4'}
          />
        ))}
      </MapView>

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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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