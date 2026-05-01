import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { User as UserIcon, Settings, CreditCard, Bell, ChevronRight, Database, LogOut } from 'lucide-react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ORLEANS_BARBERS } from '../data/orleansBarbers';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, logout } = useAuth(); // VRAIES DONNÉES ET FONCTION LOGOUT
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      for (const barber of ORLEANS_BARBERS) {
        await setDoc(doc(db, "barbers", barber.id), barber);
      }
      alert("Base de données Firestore mise à jour !");
    } catch (error) {
      console.error("Erreur d'injection :", error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* PROFIL DYNAMIQUE */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.displayName || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <MenuOption icon={UserIcon} label="Informations personnelles" />
        <MenuOption icon={CreditCard} label="Paiements" />
        <MenuOption icon={Bell} label="Notifications" />
        <MenuOption icon={Settings} label="Paramètres" />
      </View>

      {/* BOUTON DE DÉCONNEXION FONCTIONNEL */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <LogOut color="#EF4135" size={20} style={{ marginRight: 10 }} />
        <Text style={styles.logoutBtnText}>Se déconnecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.adminBtn} onPress={seedDatabase} disabled={isSeeding}>
        {isSeeding ? <ActivityIndicator color="#FFF" /> : <Database color="#FFF" size={20} style={{marginRight: 10}} />}
        <Text style={styles.adminBtnText}>Injecter 20 Barbiers (Admin)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1F3A93', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  userEmail: { color: '#555', fontSize: 14, marginTop: 4 },
  section: { backgroundColor: '#1C1C1E', borderRadius: 24, paddingVertical: 8, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  optionLabel: { color: '#EEE', fontSize: 16, fontWeight: '500' },
  logoutBtn: { marginTop: 30, backgroundColor: 'rgba(239, 65, 53, 0.1)', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 65, 53, 0.3)' },
  logoutBtnText: { color: '#EF4135', fontWeight: '700', fontSize: 16 },
  adminBtn: { marginTop: 15, backgroundColor: '#1C1C1E', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  adminBtnText: { color: '#888', fontWeight: '700', fontSize: 15 }
});