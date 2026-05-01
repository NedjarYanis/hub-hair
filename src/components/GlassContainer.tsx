import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, style }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.wrapper, style, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <BlurView intensity={95} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  blur: {
    padding: 24,
  }
});