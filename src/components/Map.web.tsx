import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

interface MapProps { barbers: Barber[]; userLoc?: any; }

export const Map: React.FC<MapProps> = ({ barbers, userLoc }) => {
  const Iframe = (props: any) => React.createElement('iframe', props);
  
  // Orléans par défaut si pas de loc
  const lat = userLoc?.latitude || 47.9029;
  const lng = userLoc?.longitude || 1.9088;
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.02},${lat-0.02},${lng+0.02},${lat+0.02}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <View style={styles.mapContainer}>
      <Iframe 
        src={mapUrl}
        style={styles.iframe as any}
      />
      <View style={styles.darkOverlay} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A0A0A' },
  iframe: { 
    width: '100%', height: '100%', border: 'none', 
    // @ts-ignore
    filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%)' 
  },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 10, 10, 0.1)' }
});