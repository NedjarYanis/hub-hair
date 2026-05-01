import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.wrapper, style]}>
      {/* Ligne Barber Shop : Bleu, Blanc, Rouge */}
      <View style={styles.barberAccentContainer}>
        <View style={[styles.stripe, { backgroundColor: '#0055A4' }]} />
        <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.stripe, { backgroundColor: '#EF4135' }]} />
      </View>
      
      <BlurView intensity={50} tint="light" style={styles.glassEffect}>
        <View style={styles.innerContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  barberAccentContainer: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  stripe: {
    flex: 1,
    height: '100%',
  },
  glassEffect: {
    flex: 1,
  },
  innerContent: {
    padding: 16,
  }
});