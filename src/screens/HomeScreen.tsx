import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GlassContainer } from '../components/GlassContainer';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Bonjour, Yanis 👋</Text>
      <Text style={styles.heroTitle}>Prêt pour un nouveau look ?</Text>

      {/* Promotions / Cards */}
      <GlassContainer style={styles.promoCard}>
        <Text style={styles.promoTag}>OFFRE LIMITÉE</Text>
        <Text style={styles.promoTitle}>-20% sur votre premier soin complet</Text>
        <TouchableOpacity style={styles.promoBtn}>
          <Text style={styles.promoBtnText}>En profiter</Text>
        </TouchableOpacity>
      </GlassContainer>

      {/* Catégories Rapides */}
      <Text style={styles.sectionTitle}>Catégories</Text>
      <View style={styles.categories}>
        {['Coupe', 'Barbe', 'Coloration', 'Soins'].map((cat, i) => (
          <TouchableOpacity key={i} style={styles.catItem}>
            <View style={styles.catIconPlaceholder} />
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Récemment consultés</Text>
      <View style={styles.recentItem}>
        <View style={styles.recentIcon} />
        <View>
          <Text style={styles.recentTitle}>The Heritage Barbershop</Text>
          <Text style={styles.recentSub}>Paris 08 • 4.9 ★</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 24, paddingBottom: 120 },
  greeting: { color: '#888', fontSize: 16, fontWeight: '500', marginTop: 40 },
  heroTitle: { color: '#FFF', fontSize: 32, fontWeight: '800', marginTop: 8, marginBottom: 30 },
  promoCard: { padding: 24, backgroundColor: '#1F3A93' },
  promoTag: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  promoTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginVertical: 12 },
  promoBtn: { backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, alignSelf: 'flex-start' },
  promoBtnText: { color: '#000', fontWeight: '700' },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginTop: 40, marginBottom: 20 },
  categories: { flexDirection: 'row', justifyContent: 'space-between' },
  catItem: { alignItems: 'center' },
  catIconPlaceholder: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#1C1C1E', marginBottom: 8 },
  catText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 20 },
  recentIcon: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#333', marginRight: 16 },
  recentTitle: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  recentSub: { color: '#888', fontSize: 13, marginTop: 2 }
});