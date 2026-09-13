import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, NeuShadows, Radius } from '../../constants/theme';

interface NeuCardProps {
  children: React.ReactNode;
  variant?: 'raised' | 'raisedSm' | 'raisedLg' | 'sunken' | 'accent';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  variant = 'raised',
  onPress,
  style,
  activeOpacity = 0.88,
}) => {
  const getShadowStyle = () => {
    switch (variant) {
      case 'raisedSm':
        return NeuShadows.raisedSm;
      case 'raisedLg':
        return NeuShadows.raisedLg;
      case 'sunken':
        return NeuShadows.sunken;
      case 'accent':
        return NeuShadows.accentRaised;
      default:
        return NeuShadows.raised;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={[styles.base, getShadowStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.base, getShadowStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    padding: 16,
  },
});
