import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

interface MapProps {
  barbers: Barber[];
}

export const Map: React.FC<MapProps> = ({ barbers }) => {
  // Création de l'élément iframe pour le Web
  const Iframe = (props: any) => React.createElement('iframe', props);
  
  // Coordonnées de Paris pour l'exemple
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=2.3122,48.8366,2.3922,48.8766&layer=mapnik";

  return (
    <View style={styles.mapContainer}>
      <Iframe 
        src={mapUrl}
        // "as any" permet d'utiliser des propriétés CSS Web pures
        style={styles.iframe as any}
        allowFullScreen={false}
      />
      {/* Voile sombre pour l'esthétique Dark Mode */}
      <View style={styles.darkOverlay} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
  },
  iframe: {
    width: '100%',
    height: '100%',
    // On utilise les noms de propriétés CSS standard
    // @ts-ignore
    border: 'none', 
    // @ts-ignore
    filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%)',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
  }
});