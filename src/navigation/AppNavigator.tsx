import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Compass, Calendar, Settings } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
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
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            height: 70,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => {
            const size = focused ? 24 : 22;
            if (route.name === 'Accueil') return <Home color={color} size={size} />;
            if (route.name === 'Services') return <Compass color={color} size={size} />;
            if (route.name === 'Activite') return <Calendar color={color} size={size} />;
            if (route.name === 'Compte') return <Settings color={color} size={size} />;
            return null;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Services" component={HomeScreen} />
        <Tab.Screen name="Activite" component={HomeScreen} />
        <Tab.Screen name="Compte" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};