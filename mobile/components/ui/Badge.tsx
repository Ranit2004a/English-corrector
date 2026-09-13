import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors, NeuShadows, Radius, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'inverted' | 'accent' | 'error' | 'success' | 'sunken';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
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
      case 'sunken':
        return styles.sunken;
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
      case 'sunken':
        return styles.textSunken;
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  default: {
    ...NeuShadows.raisedSm,
    paddingVertical: 3,
  },
  inverted: {
    backgroundColor: Colors.primary,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  accent: {
    backgroundColor: Colors.primaryAccent,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  error: {
    backgroundColor: Colors.errorContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: Colors.errorNeuShadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  success: {
    backgroundColor: Colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: Colors.successNeuShadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  sunken: {
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1,
    borderColor: Colors.neuSunkenBorder,
  },
  label: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  textDefault: {
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  textInverted: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  textAccent: {
    color: Colors.onPrimaryAccent,
    fontWeight: '700',
  },
  textError: {
    color: Colors.onErrorContainer,
    fontWeight: '700',
  },
  textSuccess: {
    color: Colors.onSuccessContainer,
    fontWeight: '700',
  },
  textSunken: {
    color: Colors.muted,
    fontWeight: '600',
  },
});
