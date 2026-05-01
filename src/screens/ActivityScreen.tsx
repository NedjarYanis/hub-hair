import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Calendar, Clock, CheckCircle, Scissors, MapPin } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useFocusEffect } from '@react-navigation/native';

export const ActivityScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect déclenche la fonction à chaque fois que tu ouvres cet onglet !
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // On va chercher la liste de toutes les réservations
      const snapshot = await getDocs(collection(db, 'bookings'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // On les trie de la plus récente à la plus ancienne (via la date de création)
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setBookings(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date (ex: "2023-10-25" -> "25/10/2023")
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateString;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Réservations</Text>
        <Text style={styles.subtitle}>Historique de vos rendez-vous</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#4285F4" size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Scissors color="#333" size={48} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyText}>Aucune réservation pour le moment.</Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.card}>
                
                {/* En-tête de la carte : Nom du salon & Statut */}
                <View style={styles.cardHeader}>
                  <Text style={styles.barberName}>{booking.barberName}</Text>
                  <View style={styles.statusBadge}>
                    <CheckCircle color="#4CAF50" size={14} style={{ marginRight: 4 }} />
                    <Text style={styles.statusText}>Confirmé</Text>
                  </View>
                </View>

                {/* Corps de la carte : Date & Heure */}
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Calendar color="#888" size={16} style={{ marginRight: 8 }} />
                    <Text style={styles.infoText}>{formatDate(booking.date)}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Clock color="#888" size={16} style={{ marginRight: 8 }} />
                    <Text style={styles.infoText}>{booking.time}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Pied de la carte : Prix & Bouton Y aller */}
                <View style={styles.cardFooter}>
                  <Text style={styles.price}>{booking.price}€</Text>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MapPin color="#FFF" size={16} style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>Y aller</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#141414', borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#888', fontSize: 15, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#666', fontSize: 16 },

  card: { backgroundColor: '#1C1C1E', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2C' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  barberName: { color: '#FFF', fontSize: 18, fontWeight: '700', flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
  statusText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  
  infoRow: { flexDirection: 'row', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  infoText: { color: '#CCC', fontSize: 15, fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#2A2A2C', marginBottom: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4285F4', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' }
});