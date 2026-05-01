import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Barber } from '../types';

interface MapProps {
  barbers: Barber[];
}

export const Map: React.FC<MapProps> = ({ barbers }) => {
  return (
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
      {barbers.map((barber) => (
        <Marker
          key={barber.id}
          coordinate={{ latitude: barber.latitude, longitude: barber.longitude }}
          title={barber.name}
          description={barber.isMobile ? "Coiffeur mobile" : "Salon fixe"}
          pinColor={barber.isMobile ? '#EF4135' : '#0055A4'}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});