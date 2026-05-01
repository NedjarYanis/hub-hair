import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Search, Calendar, User } from 'lucide-react-native';

// Importations désormais valides
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
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
            if (route.name === 'Compte') return <User color={color} size={size} />;
            return null;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Services" component={DiscoveryScreen} />
        <Tab.Screen name="Activite" component={ActivityScreen} />
        <Tab.Screen name="Compte" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};