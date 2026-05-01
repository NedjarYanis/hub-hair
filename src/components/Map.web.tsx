import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

interface MapProps {
  barbers: Barber[];
  centerLat?: number;
  centerLng?: number;
  onMarkerPress?: (barberId: string) => void; // NOUVELLE PROP : La fonction déclenchée au clic
}

export const Map: React.FC<MapProps> = ({ barbers, centerLat, centerLng, onMarkerPress }) => {
  const Iframe = (props: any) => React.createElement('iframe', props);
  
  const lat = centerLat || 47.9029;
  const lng = centerLng || 1.9088;

  // 1. LE RÉCEPTEUR (React écoute la carte)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      try {
        // On décode le message envoyé par l'iframe
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Si c're un clic sur un marqueur, on déclenche la mise à jour !
        if (data && data.type === 'BARBER_CLICKED' && onMarkerPress) {
          onMarkerPress(data.id);
        }
      } catch (e) {
        // On ignore les erreurs (parfois causées par les extensions Chrome)
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onMarkerPress]);

  // 2. L'ÉMETTEUR (Dans le code HTML de la carte)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; background-color: #0A0A0A; }
            #map { width: 100vw; height: 100vh; }
            .leaflet-layer, .leaflet-control-zoom { filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%); }
            .leaflet-popup-content-wrapper { background-color: #1C1C1E; color: #FFF; border-radius: 12px; }
            .leaflet-popup-tip { background-color: #1C1C1E; }
            .leaflet-container a.leaflet-popup-close-button { color: #FFF; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            const map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

            const barbers = ${JSON.stringify(barbers)};
            
            barbers.forEach(b => {
                const marker = L.marker([b.latitude, b.longitude]).addTo(map);
                
                const type = b.isMobile ? "🚗 À Domicile" : "💈 Salon";
                const html = '<div style="text-align:center; padding: 5px;">' +
                             '<strong style="font-size:14px; margin-bottom:4px; display:block;">' + b.name + '</strong>' +
                             '<span style="color:#A0A0A0; font-size:12px;">' + type + ' • ⭐ ' + b.rating + '</span>' +
                             '</div>';
                
                marker.bindPopup(html);

                // LA MAGIE EST ICI : Quand on clique sur le marqueur, on envoie un SMS à React !
                marker.on('click', function() {
                    window.parent.postMessage(JSON.stringify({ type: 'BARBER_CLICKED', id: b.id }), '*');
                });
            });
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.mapContainer}>
      <Iframe srcDoc={htmlContent} style={styles.iframe as any} allowFullScreen={false} />
      <View style={styles.darkOverlay} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A0A0A' },
  iframe: { width: '100%', height: '100%', border: 'none' as any },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 10, 10, 0.1)' }
});