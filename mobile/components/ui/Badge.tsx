import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Radius, Typography } from '../../constants/theme';
import { useTheme } from '../../constants/useTheme';

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
  const { colors, shadows, isDark } = useTheme();

  const getVariantContainer = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'inverted':
        return {
          backgroundColor: colors.primary,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          shadowColor: colors.neuDarkDeep,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: isDark ? 0.8 : 0.5,
          shadowRadius: 4,
          elevation: 2,
        };
      case 'accent':
        return {
          backgroundColor: colors.primaryAccent,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          shadowColor: colors.primaryAccent,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.35,
          shadowRadius: 5,
          elevation: 3,
        };
      case 'error':
        return {
          backgroundColor: colors.errorContainer,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
          shadowColor: colors.errorNeuShadow,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        };
      case 'success':
        return {
          backgroundColor: colors.successContainer,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.8)',
          shadowColor: colors.successNeuShadow,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        };
      case 'sunken':
        return {
          backgroundColor: colors.surfaceSunken,
          borderWidth: 1,
          borderColor: colors.neuSunkenBorder,
        };
      default:
        return [
          shadows.raisedSm,
          { paddingVertical: 3 },
        ];
    }
  };

  const getVariantText = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'inverted':
        return { color: colors.onPrimary, fontWeight: '700' };
      case 'accent':
        return { color: colors.onPrimaryAccent, fontWeight: '700' };
      case 'error':
        return { color: colors.onErrorContainer, fontWeight: '700' };
      case 'success':
        return { color: colors.onSuccessContainer, fontWeight: '700' };
      case 'sunken':
        return { color: colors.muted, fontWeight: '600' };
      default:
        return { color: colors.onSurfaceVariant, fontWeight: '700' };
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
  label: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
});
