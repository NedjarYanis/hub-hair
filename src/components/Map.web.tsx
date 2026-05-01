import React, { useEffect, memo, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

// La coquille de l'iframe est stabilisée
const Iframe = React.forwardRef((props: any, ref) => React.createElement('iframe', { ...props, ref }));

interface MapProps {
  barbers: Barber[];
  centerLat?: number;
  centerLng?: number;
  onMarkerPress?: (barberId: string) => void;
}

export const Map = memo(({ barbers, centerLat, centerLng, onMarkerPress }: MapProps) => {
  const iframeRef = useRef<any>(null);

  // 1. Écoute les clics sur les marqueurs pour mettre à jour l'interface React
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

  // 2. LE MOTEUR DE ZOOM : Quand l'utilisateur fait une recherche, on envoie l'ordre à la carte de "voler" vers l'adresse
  useEffect(() => {
    if (centerLat && centerLng && iframeRef.current && iframeRef.current.contentWindow) {
      // On demande un zoom de niveau 16 (très précis, niveau rue)
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: 'FLY_TO', lat: centerLat, lng: centerLng, zoom: 16 }),
        '*'
      );
    }
  }, [centerLat, centerLng]);

  // 3. LA CARTE (Mémorisée pour éviter tout flash blanc pendant qu'on tape au clavier)
  const htmlContent = useMemo(() => {
    // Orléans par défaut au premier chargement
    const initialLat = 47.9029;
    const initialLng = 1.9088;

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
              body { margin: 0; padding: 0; background-color: #E5E3DF; }
              #map { width: 100vw; height: 100vh; }
              .leaflet-popup-content-wrapper { border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
              
              /* Design des points sur la carte (Google Maps Blue) */
              .uber-dot {
                  background-color: #1A73E8; 
                  border: 3px solid #FFF;
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(0,0,0,0.5);
                  width: 16px !important;
                  height: 16px !important;
                  margin-top: -8px !important;
                  margin-left: -8px !important;
              }
          </style>
      </head>
      <body>
          <div id="map"></div>
          <script>
              const map = L.map('map', { zoomControl: false }).setView([${initialLat}, ${initialLng}], 13);
              
              // Les tuiles officielles de Google Maps
              L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: '© Google'
              }).addTo(map);

              const barbers = ${JSON.stringify(barbers)};
              
              barbers.forEach(b => {
                  const customIcon = L.divIcon({ className: 'uber-dot' });
                  const marker = L.marker([b.latitude, b.longitude], { icon: customIcon }).addTo(map);
                  
                  const type = b.isMobile ? "🚗 À Domicile" : "💈 Salon";
                  const html = '<div style="text-align:center; padding: 5px;">' +
                               '<strong style="font-size:14px; margin-bottom:4px; display:block; color:#000;">' + b.name + '</strong>' +
                               '<span style="color:#555; font-size:12px;">' + type + ' • ⭐ ' + b.rating + '</span>' +
                               '</div>';
                  
                  marker.bindPopup(html);
                  marker.on('click', function() {
                      window.parent.postMessage(JSON.stringify({ type: 'BARBER_CLICKED', id: b.id }), '*');
                  });
              });

              // ÉCOUTEUR SECRET : Reçoit les ordres de React pour faire "voler" la caméra
              window.addEventListener('message', function(event) {
                  try {
                      const data = JSON.parse(event.data);
                      if (data.type === 'FLY_TO') {
                          // L'animation de zoom ultra fluide !
                          map.flyTo([data.lat, data.lng], data.zoom, {
                              animate: true,
                              duration: 1.5
                          });
                      }
                  } catch(e) {}
              });
          </script>
      </body>
      </html>
    `;
  }, [barbers]); // Le code HTML ne se recalcule que si la liste des barbiers change

  return (
    <View style={styles.mapContainer}>
      <Iframe 
        ref={iframeRef} 
        srcDoc={htmlContent} 
        style={styles.iframe as any} 
        allowFullScreen={false} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  mapContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E5E3DF' },
  iframe: { width: '100%', height: '100%', border: 'none' as any }
});