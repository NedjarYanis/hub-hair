import React, { useEffect, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

interface MapProps {
  barbers: Barber[];
  centerLat?: number;
  centerLng?: number;
  onMarkerPress?: (barberId: string) => void;
}

// React.memo est la magie qui empêche la carte de clignoter ou de se réinitialiser !
export const Map = memo(({ barbers, centerLat, centerLng, onMarkerPress }: MapProps) => {
  const Iframe = (props: any) => React.createElement('iframe', props);
  
  const lat = centerLat || 47.9029;
  const lng = centerLng || 1.9088;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'BARBER_CLICKED' && onMarkerPress) {
          onMarkerPress(data.id);
        }
      } catch (e) {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onMarkerPress]);

  // VRAIE carte Dark Mode premium (CartoDB) au lieu du filtre CSS moche
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
            .leaflet-popup-content-wrapper { background-color: #1C1C1E; color: #FFF; border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
            .leaflet-popup-tip { background-color: #1C1C1E; }
            .leaflet-container a.leaflet-popup-close-button { color: #FFF; }
            
            /* Design des points sur la carte façon Uber */
            .uber-dot {
                background-color: #FFF;
                border: 3px solid #1F3A93;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0,0,0,0.8);
                width: 14px !important;
                height: 14px !important;
                margin-top: -7px !important;
                margin-left: -7px !important;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            const map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 13);
            
            // Les tuiles de carte "Dark Matter" (Identique à l'ambiance Uber)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(map);

            const barbers = ${JSON.stringify(barbers)};
            
            barbers.forEach(b => {
                const customIcon = L.divIcon({ className: 'uber-dot' });
                const marker = L.marker([b.latitude, b.longitude], { icon: customIcon }).addTo(map);
                
                const type = b.isMobile ? "🚗 À Domicile" : "💈 Salon";
                const html = '<div style="text-align:center; padding: 5px;">' +
                             '<strong style="font-size:14px; margin-bottom:4px; display:block;">' + b.name + '</strong>' +
                             '<span style="color:#A0A0A0; font-size:12px;">' + type + ' • ⭐ ' + b.rating + '</span>' +
                             '</div>';
                
                marker.bindPopup(html);
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
    </View>
  );
});

const styles = StyleSheet.create({
  mapContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A0A0A' },
  iframe: { width: '100%', height: '100%', border: 'none' as any }
});