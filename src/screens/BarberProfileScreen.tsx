import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Check, Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const BarberProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { barberId, barberName } = route.params;

  // --- ÉTATS RÉELS (FINI LE "FAKE") ---
  const [services, setServices] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingBarber, setLoadingBarber] = useState(true);
  
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // 1. CHARGEMENT DYNAMIQUE DES SERVICES ET HORAIRES DU BARBIER
  useEffect(() => {
    const loadBarberDetails = async () => {
      try {
        const barberRef = doc(db, "barbers", barberId);
        const barberSnap = await getDoc(barberRef);
        
        if (barberSnap.exists()) {
          const data = barberSnap.data();
          // On récupère les services réels stockés dans Firebase
          setServices(data.services || []);
          if (data.services?.length > 0) setSelectedService(data.services[0].id);
          
          // GÉNÉRATION DES CRÉNEAUX SELON SES HORAIRES RÉELS
          const start = parseInt(data.businessHours?.start || "09");
          const end = parseInt(data.businessHours?.end || "18");
          const slots = [];
          for (let h = start; h < end; h++) {
            slots.push(`${h < 10 ? '0'+h : h}:00`);
            slots.push(`${h < 10 ? '0'+h : h}:30`);
          }
          setTimeSlots(slots);
        }
      } catch (e) {
        console.error("Erreur chargement barbier:", e);
      } finally {
        setLoadingBarber(false);
      }
    };
    loadBarberDetails();
  }, [barberId]);

  // GÉNÉRATEUR DE DATES (7 prochains jours)
  const dates = useMemo(() => {
    const days = [];
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const fullDate = d.toISOString().split('T')[0];
      days.push({ id: fullDate, dayName: weekDays[d.getDay()], dayNum: d.getDate() });
    }
    return days;
  }, []);

  // Initialisation par défaut de la date
  useEffect(() => { 
    if (dates.length > 0) setSelectedDate(dates[0].id); 
  }, [dates]);

  // 2. RÉCUPÉRATION DES CRÉNEAUX DÉJÀ RÉSERVÉS
  useEffect(() => {
    if (!selectedDate) return;
    const fetchBookedSlots = async () => {
      setIsFetchingSlots(true);
      setSelectedTime(null);
      try {
        const q = query(
          collection(db, 'bookings'), 
          where('barberId', '==', barberId), 
          where('date', '==', selectedDate)
        );
        const snapshot = await getDocs(q);
        setBookedSlots(snapshot.docs.map(doc => doc.data().time));
      } catch (e) {
        console.error("Erreur créneaux réservés:", e);
      } finally {
        setIsFetchingSlots(false);
      }
    };
    fetchBookedSlots();
  }, [selectedDate, barberId]);

  const totalAmount = services.find(s => s.id === selectedService)?.price || 0;

  // 3. ENREGISTREMENT DE LA RÉSERVATION RÉELLE
  const handleBooking = async () => {
    if (!selectedTime) return alert('Veuillez choisir une heure.');
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
      alert(`Réservation confirmée !`);
      navigation.goBack();
    } catch (e) {
      alert("Erreur lors de la réservation.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loadingBarber) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#4285F4" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{barberName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SERVICES RÉELS */}
        <Text style={styles.sectionTitle}>1. Prestations</Text>
        <View style={styles.serviceList}>
          {services.map((service) => {
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
                  {isSelected && <View style={styles.checkBadge}><Check color="#000" size={12} /></View>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CALENDRIER DYNAMIQUE */}
        <Text style={styles.sectionTitle}>2. Date</Text>
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

        {/* CRÉNEAUX CALCULÉS ET BLOQUÉS */}
        <View style={styles.timeHeader}>
          <Text style={styles.sectionTitle}>3. Heure</Text>
          {isFetchingSlots && <ActivityIndicator color="#4285F4" size="small" />}
        </View>
        <View style={styles.timeGrid}>
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            const isTaken = bookedSlots.includes(time); // Désactivation réelle si réservé
            return (
              <TouchableOpacity 
                key={time} 
                disabled={isTaken}
                style={[
                  styles.timeBox, 
                  isSelected && styles.timeBoxActive,
                  isTaken && styles.timeBoxTaken
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText, 
                  isSelected && styles.textActive,
                  isTaken && styles.timeTextTaken
                ]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* FOOTER TRANSACTIONNEL */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotal}>Total</Text>
          <Text style={styles.footerPrice}>{totalAmount}€</Text>
        </View>
        <TouchableOpacity 
          style={[styles.bookBtn, (!selectedTime || isBooking) && styles.bookBtnDisabled]} 
          onPress={handleBooking}
          disabled={!selectedTime || isBooking}
        >
          {isBooking ? <ActivityIndicator color="#FFF" /> : <Text style={styles.bookBtnText}>Confirmer</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
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
  checkBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4285F4', justifyContent: 'center', alignItems: 'center' },
  dateScroll: { flexDirection: 'row', marginBottom: 10 },
  dateBox: { width: 70, height: 90, borderRadius: 16, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dateBoxActive: { backgroundColor: '#FFF' },
  dayName: { color: '#888', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dayNum: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  timeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBox: { width: '31%', height: 50, borderRadius: 12, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' },
  timeBoxActive: { backgroundColor: '#FFF' },
  timeBoxTaken: { backgroundColor: '#000', opacity: 0.3, borderWidth: 1, borderColor: '#222' },
  timeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  textActive: { color: '#000' },
  timeTextTaken: { textDecorationLine: 'line-through', color: '#444' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#141414', flexDirection: 'row', padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#222', alignItems: 'center' },
  footerInfo: { flex: 1 },
  footerTotal: { color: '#888', fontSize: 14 },
  footerPrice: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  bookBtn: { backgroundColor: '#4285F4', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 100 },
  bookBtnDisabled: { backgroundColor: '#333' },
  bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});