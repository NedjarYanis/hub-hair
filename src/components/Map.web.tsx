import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Barber } from '../types';

interface MapProps {
  barbers: Barber[];
}

export const Map: React.FC<MapProps> = ({ barbers }) => {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.text}>🗺️ Carte interactive</Text>
      <Text style={styles.subtext}>(Vue désactivée sur la version Web - Disponible sur l'App)</Text>
      
      {barbers.map((barber) => (
        <View key={barber.id} style={styles.barberItem}>
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text>{barber.isMobile ? "🚗 À domicile" : "💈 Salon fixe"}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Dimensions.get('window').height / 3, // Laisse de la place pour le composant Glassmorphism
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  barberItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0055A4', // Touche Barber
  },
  barberName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  }
});