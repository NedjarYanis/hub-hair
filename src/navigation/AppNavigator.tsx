import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Scissors, Clock, User } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Composants temporaires complets pour garantir l'intégrité du code
const ServicesScreen = () => <View style={styles.center}><Text>Liste des Prestations</Text></View>;
const ActivityScreen = () => <View style={styles.center}><Text>Historique des Rendez-vous</Text></View>;
const AccountScreen = () => <View style={styles.center}><Text>Profil & Mode Coiffeur</Text></View>;

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0055A4', // Bleu Barber
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Accueil') return <Home color={color} size={size} />;
            if (route.name === 'Services') return <Scissors color={color} size={size} />;
            if (route.name === 'Activite') return <Clock color={color} size={size} />;
            if (route.name === 'Compte') return <User color={color} size={size} />;
            return null;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        <Tab.Screen name="Activite" component={ActivityScreen} />
        <Tab.Screen name="Compte" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  }
});