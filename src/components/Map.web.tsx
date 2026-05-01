import React, { useEffect, memo, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Barber } from '../types';

const Iframe = React.forwardRef((props: any, ref) => React.createElement('iframe', { ...props, ref }));

interface MapProps {
  barbers: Barber[];
  centerLat?: number;
  centerLng?: number;
  onMarkerPress?: (barberId: string) => void;
  // NOUVEAU : On accepte la position exacte de l'utilisateur
  userLocation?: { latitude: number; longitude: number } | null; 
}

export const Map = memo(({ barbers, centerLat, centerLng, onMarkerPress, userLocation }: MapProps) => {
  const iframeRef = useRef<any>(null);

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

  useEffect(() => {
    if (centerLat && centerLng && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ type: 'FLY_TO', lat: centerLat, lng: centerLng, zoom: 15 }),
        '*'
      );
    }
  }, [centerLat, centerLng]);

  // On ajoute userLocation dans les dépendances pour que la carte se mette à jour quand le GPS te trouve
  const htmlContent = useMemo(() => {
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

              /* NOUVEAU : Le design du point bleu utilisateur avec pulsation radar */
              .user-loc-container { position: relative; }
              .user-loc-dot {
                  width: 18px; height: 18px;
                  background-color: #4285F4;
                  border: 3px solid white;
                  border-radius: 50%;
                  position: absolute;
                  top: -9px; left: -9px;
                  box-shadow: 0 0 6px rgba(0,0,0,0.4);
                  z-index: 2;
              }
              .user-loc-pulse {
                  width: 46px; height: 46px;
                  background-color: rgba(66, 133, 244, 0.4);
                  border-radius: 50%;
                  position: absolute;
                  top: -23px; left: -23px;
                  animation: pulse 2s infinite ease-out;
                  z-index: 1;
              }
              @keyframes pulse {
                  0% { transform: scale(0.3); opacity: 1; }
                  100% { transform: scale(1.2); opacity: 0; }
              }
          </style>
      </head>
      <body>
          <div id="map"></div>
          <script>
              const map = L.map('map', { zoomControl: false }).setView([${initialLat}, ${initialLng}], 13);
              
              L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: '© Google'
              }).addTo(map);

              const barbers = ${JSON.stringify(barbers)};
              const userLoc = ${JSON.stringify(userLocation || null)};

              // 1. On dessine d'abord le point bleu du GPS s'il existe
              if (userLoc) {
                  const userHtml = '<div class="user-loc-container"><div class="user-loc-pulse"></div><div class="user-loc-dot"></div></div>';
                  const userIcon = L.divIcon({ className: '', html: userHtml });
                  // zIndexOffset: 1000 permet au point bleu d'être TOUJOURS au-dessus des autres marqueurs
                  L.marker([userLoc.latitude, userLoc.longitude], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
              }
              
              // 2. On dessine les salons de coiffure
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

              window.addEventListener('message', function(event) {
                  try {
                      const data = JSON.parse(event.data);
                      if (data.type === 'FLY_TO') {
                          map.flyTo([data.lat, data.lng], data.zoom, { animate: true, duration: 1.5 });
                      }
                  } catch(e) {}
              });
          </script>
      </body>
      </html>
    `;
  }, [barbers, userLocation]);

  return (
    <View style={styles.mapContainer}>
      <Iframe ref={iframeRef} srcDoc={htmlContent} style={styles.iframe as any} allowFullScreen={false} />
    </View>
  );
});

const styles = StyleSheet.create({
  mapContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E5E3DF' },
  iframe: { width: '100%', height: '100%', border: 'none' as any }
});