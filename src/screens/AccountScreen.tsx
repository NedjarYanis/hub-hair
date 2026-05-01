import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { User, Settings, CreditCard, Bell, ChevronRight, Database } from 'lucide-react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ORLEANS_BARBERS } from '../data/orleansBarbers';

const MenuOption = ({ icon: Icon, label, color = "#FFF" }: any) => (
  <TouchableOpacity style={styles.option}>
    <View style={styles.optionLeft}>
      <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
    <ChevronRight color="#333" size={20} />
  </TouchableOpacity>
);

export const AccountScreen = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  // Fonction d'administration pour injecter les données dans Firebase
  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      for (const barber of ORLEANS_BARBERS) {
        // Crée ou écrase le document dans la collection "barbers" avec l'ID spécifié
        await setDoc(doc(db, "barbers", barber.id), barber);
      }
      alert("✅ Base de données Firestore mise à jour avec 20 barbiers d'Orléans !");
    } catch (error) {
      console.error("Erreur lors de l'injection :", error);
      alert("❌ Erreur de connexion à Firebase.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><User color="#000" size={30} /></View>
        <Text style={styles.userName}>Yanis Nedjar</Text>
        <Text style={styles.userEmail}>yanis@startup.tech</Text>
      </View>

      <View style={styles.section}>
        <MenuOption icon={User} label="Informations personnelles" />
        <MenuOption icon={CreditCard} label="Paiements" />
        <MenuOption icon={Bell} label="Notifications" />
        <MenuOption icon={Settings} label="Paramètres" />
      </View>

      {/* BOUTON D'ADMINISTRATION SECRET */}
      <TouchableOpacity 
        style={styles.adminBtn} 
        onPress={seedDatabase}
        disabled={isSeeding}
      >
        {isSeeding ? <ActivityIndicator color="#FFF" /> : <Database color="#FFF" size={20} style={{marginRight: 10}} />}
        <Text style={styles.adminBtnText}>
          {isSeeding ? "Injection en cours..." : "Injecter 20 Barbiers (Firebase)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.barberMode}>
        <Text style={styles.barberText}>Devenir Coiffeur</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  userName: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  userEmail: { color: '#555', fontSize: 14, marginTop: 4 },
  section: { backgroundColor: '#1C1C1E', borderRadius: 24, paddingVertical: 8, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionLabel: { color: '#EEE', fontSize: 16, fontWeight: '500' },
  adminBtn: { marginTop: 30, backgroundColor: '#78281F', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  adminBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  barberMode: { marginTop: 15, backgroundColor: '#1F3A93', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  barberText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});