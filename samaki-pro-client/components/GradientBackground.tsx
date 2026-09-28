import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      // Clean Enterprise Light Theme Gradient
      colors={['#F8F9FA', '#E3F2FD', '#CAF0F8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
