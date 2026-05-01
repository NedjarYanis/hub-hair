import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Search, Calendar, User as UserIcon } from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { BarberProfileScreen } from '../screens/BarberProfileScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { LoginScreen } from '../screens/LoginScreen'; 
import { RootTabParamList, DiscoveryStackParamList } from '../types';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

/**
 * Stack de navigation pour l'onglet Services (Recherche)
 * Permet de naviguer de la carte vers le profil détaillé du coiffeur
 */
const DiscoveryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DiscoveryMain" component={DiscoveryScreen} />
      <Stack.Screen name="BarberProfile" component={BarberProfileScreen} />
    </Stack.Navigator>
  );
};

/**
 * Composant principal de gestion de l'état d'authentification
 * Si l'utilisateur n'est pas connecté, on affiche l'écran de Login
 * Sinon, on affiche le menu principal (Tabs)
 */
const MainApp = () => {
  const { user, loadingAuth } = useAuth();

  // Affichage d'un loader pendant que Firebase vérifie la session
  if (loadingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {!user ? (
        // Écran de connexion/inscription (Google & Email)
        <LoginScreen />
      ) : (
        // Menu principal de l'application une fois connecté
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: '#444',
            tabBarStyle: {
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
              position: 'absolute',
              borderTopWidth: 0,
              height: Platform.OS === 'ios' ? 88 : 75,
              paddingBottom: Platform.OS === 'ios' ? 30 : 20,
              paddingTop: 12,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              elevation: 0,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => {
              const size = focused ? 28 : 24;
              if (route.name === 'Accueil') return <Home color={color} size={size} />;
              if (route.name === 'Services') return <Search color={color} size={size} />;
              if (route.name === 'Activite') return <Calendar color={color} size={size} />;
              if (route.name === 'Compte') return <UserIcon color={color} size={size} />;
              return null;
            },
          })}
        >
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Services" component={DiscoveryStack} />
          <Tab.Screen name="Activite" component={ActivityScreen} />
          <Tab.Screen name="Compte" component={AccountScreen} />
        </Tab.Navigator>
      )}
    </View>
  );
};

/**
 * Point d'entrée de la navigation englobé dans le fournisseur d'authentification
 */
export const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
};