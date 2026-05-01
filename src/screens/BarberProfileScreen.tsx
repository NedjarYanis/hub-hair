import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Fausses données pour les prestations (Dans une app finale, ça viendrait aussi de Firebase)
const SERVICES = [
  { id: 's1', name: 'Coupe Classique', price: 25, duration: 30 },
  { id: 's2', name: 'Dégradé à blanc (Fade)', price: 28, duration: 45 },
  { id: 's3', name: 'Taille de barbe (Serviette chaude)', price: 18, duration: 30 },
  { id: 's4', name: 'Forfait VIP (Coupe + Barbe + Soin)', price: 50, duration: 75 },
];

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export const BarberProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { barberId, barberName } = route.params;

  // Générateur des 7 prochains jours avec de VRAIES dates formatées (YYYY-MM-DD)
  const dates = useMemo(() => {
    const days = [];
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const fullDate = d.toISOString().split('T')[0]; // Ex: "2023-10-25"
      days.push({ id: fullDate, dayName: weekDays[d.getDay()], dayNum: d.getDate() });
    }
    return days;
  }, []);

  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState(dates[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // États pour Firebase
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Étape 1 : Récupérer les créneaux déjà réservés dans Firebase à chaque changement de date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsFetchingSlots(true);
      setSelectedTime(null); // On réinitialise l'heure choisie quand on change de jour
      try {
        const q = query(
          collection(db, 'bookings'), 
          where('barberId', '==', barberId),
          where('date', '==', selectedDate)
        );
        const snapshot = await getDocs(q);
        const taken = snapshot.docs.map(doc => doc.data().time);
        setBookedSlots(taken);
      } catch (error) {
        console.error("Erreur de récupération des créneaux :", error);
      } finally {
        setIsFetchingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, barberId]);

  const totalAmount = SERVICES.find(s => s.id === selectedService)?.price || 0;

  // Étape 2 : Envoyer la réservation dans Firebase
  const handleBooking = async () => {
    if (!selectedTime) return alert('Veuillez choisir un créneau horaire.');
    setIsBooking(true);
    
    try {
      await addDoc(collection(db, 'bookings'), {
        barberId,
        barberName,
        date: selectedDate,
        time: selectedTime,
        serviceId: selectedService,
        price: totalAmount,
        createdAt: new Date().toISOString(),
        status: 'confirmé'
      });
      
      alert(`🎉 Réservation confirmée chez ${barberName} le ${selectedDate} à ${selectedTime} !`);
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert('Une erreur est survenue lors de la réservation.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{barberName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* PRESTATIONS */}
        <Text style={styles.sectionTitle}>1. Choisissez une prestation</Text>
        <View style={styles.serviceList}>
          {SERVICES.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <TouchableOpacity 
                key={service.id} 
                style={[styles.serviceCard, isSelected && styles.serviceCardActive]}
                onPress={() => setSelectedService(service.id)}
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                </View>
                <View style={styles.servicePriceBox}>
                  <Text style={styles.servicePrice}>{service.price}€</Text>
                  {isSelected && <View style={styles.checkBadge}><Check color="#000" size={14} /></View>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CALENDRIER */}
        <Text style={styles.sectionTitle}>2. Date du rendez-vous</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {dates.map((d) => {
            const isSelected = selectedDate === d.id;
            return (
              <TouchableOpacity 
                key={d.id} 
                style={[styles.dateBox, isSelected && styles.dateBoxActive]}
                onPress={() => setSelectedDate(d.id)}
              >
                <Text style={[styles.dayName, isSelected && styles.textActive]}>{d.dayName}</Text>
                <Text style={[styles.dayNum, isSelected && styles.textActive]}>{d.dayNum}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* CRÉNEAUX HORAIRES CONNECTÉS */}
        <View style={styles.timeHeader}>
          <Text style={styles.sectionTitle}>3. Créneau horaire</Text>
          {isFetchingSlots && <ActivityIndicator color="#4285F4" size="small" />}
        </View>
        
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            const isTaken = bookedSlots.includes(time); // Magie : on vérifie si Firebase a dit que c'était pris

            return (
              <TouchableOpacity 
                key={time} 
                disabled={isTaken}
                style={[
                  styles.timeBox, 
                  isSelected && styles.timeBoxActive,
                  isTaken && styles.timeBoxTaken // Style grisé si réservé
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText, 
                  isSelected && styles.textActive,
                  isTaken && styles.timeTextTaken // Texte barré
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* FOOTER DE PAIEMENT */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotal}>Total à payer</Text>
          <Text style={styles.footerPrice}>{totalAmount}€</Text>
        </View>
        <TouchableOpacity 
          style={[styles.bookBtn, (!selectedTime || isBooking) && styles.bookBtnDisabled]} 
          onPress={handleBooking}
          disabled={!selectedTime || isBooking}
        >
          {isBooking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.bookBtnText}>Confirmer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 15 },
  content: { padding: 20, paddingBottom: 120 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 15, marginTop: 10 },
  
  serviceList: { gap: 12 },
  serviceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
  serviceCardActive: { borderColor: '#4285F4', backgroundColor: 'rgba(66, 133, 244, 0.1)' },
  serviceInfo: { flex: 1 },
  serviceName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  serviceDuration: { color: '#888', fontSize: 13, marginTop: 4 },
  servicePriceBox: { flexDirection: 'row', alignItems: 'center' },
  servicePrice: { color: '#FFF', fontSize: 18, fontWeight: '700', marginRight: 10 },
  checkBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#4285F4', justifyContent: 'center', alignItems: 'center' },

  dateScroll: { flexDirection: 'row', marginBottom: 10 },
  dateBox: { width: 70, height: 90, borderRadius: 16, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: 'transparent' },
  dateBoxActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  dayName: { color: '#888', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dayNum: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  
  timeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBox: { width: '31%', height: 50, borderRadius: 12, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  timeBoxActive: { backgroundColor: '#FFF' },
  timeBoxTaken: { backgroundColor: '#0A0A0A', borderColor: '#222', opacity: 0.5 },
  timeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  textActive: { color: '#000' },
  timeTextTaken: { color: '#444', textDecorationLine: 'line-through' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#141414', flexDirection: 'row', padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#222', alignItems: 'center', justifyContent: 'space-between' },
  footerInfo: { flex: 1 },
  footerTotal: { color: '#888', fontSize: 14 },
  footerPrice: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  bookBtn: { backgroundColor: '#4285F4', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 100 },
  bookBtnDisabled: { backgroundColor: '#333' },
  bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});