import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'inverted' | 'accent' | 'error' | 'success';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getVariantContainer = () => {
    switch (variant) {
      case 'inverted':
        return styles.inverted;
      case 'accent':
        return styles.accent;
      case 'error':
        return styles.error;
      case 'success':
        return styles.success;
      default:
        return styles.default;
    }
  };

  const getVariantText = () => {
    switch (variant) {
      case 'inverted':
        return styles.textInverted;
      case 'accent':
        return styles.textAccent;
      case 'error':
        return styles.textError;
      case 'success':
        return styles.textSuccess;
      default:
        return styles.textDefault;
    }
  };

  return (
    <View style={[styles.container, getVariantContainer(), style]}>
      <Text style={[styles.label, getVariantText(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  inverted: {
    backgroundColor: Colors.primary,
  },
  accent: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  error: {
    backgroundColor: Colors.errorContainer,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  success: {
    backgroundColor: Colors.successContainer,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  label: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  textDefault: {
    color: Colors.onSurface,
  },
  textInverted: {
    color: Colors.onPrimary,
  },
  textAccent: {
    color: Colors.primary,
  },
  textError: {
    color: Colors.onErrorContainer,
  },
  textSuccess: {
    color: Colors.success,
  },
});
