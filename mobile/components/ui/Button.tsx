import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleProp,
} from 'react-native';
import { Colors, NeuShadows, Radius, Typography } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'sunken';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getContainerStyle = () => {
    if (isPressed) {
      return styles.pressed;
    }

    switch (variant) {
      case 'accent':
        return [styles.accent, NeuShadows.accentRaised];
      case 'secondary':
        return [styles.secondary, NeuShadows.raisedSm];
      case 'outline':
        return [styles.outline, NeuShadows.raisedSm];
      case 'danger':
        return [styles.danger, NeuShadows.raisedSm];
      case 'sunken':
        return [styles.sunken, NeuShadows.sunken];
      default:
        // Primary is a sleek elevated slate/charcoal with subtle top highlight
        return [styles.primary, NeuShadows.raised];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.textAccent;
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'danger':
        return styles.textDanger;
      case 'sunken':
        return styles.textSunken;
      default:
        return styles.textPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      default:
        return styles.sizeMd;
    }
  };

  const getSpinnerColor = () => {
    if (variant === 'secondary' || variant === 'outline' || variant === 'sunken') {
      return Colors.onSurface;
    }
    return Colors.onPrimary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled || loading}
      style={[
        styles.base,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getSpinnerColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.textBase, getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    gap: 8,
  },
  sizeSm: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
  },
  sizeMd: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: Radius.lg,
  },
  sizeLg: {
    height: 58,
    paddingHorizontal: 26,
    borderRadius: Radius.xl,
  },
  primary: {
    backgroundColor: Colors.primary,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    shadowColor: Colors.neuDarkDeep,
  },
  accent: {
    backgroundColor: Colors.primaryAccent,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  outline: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.neuDark,
  },
  danger: {
    backgroundColor: Colors.errorContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: Colors.errorNeuShadow,
  },
  sunken: {
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1,
    borderColor: Colors.neuSunkenBorder,
  },
  pressed: {
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1.5,
    borderColor: Colors.neuSunkenBorder,
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    ...Typography.labelLg,
  },
  textPrimary: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  textAccent: {
    color: Colors.onPrimaryAccent,
    fontWeight: '700',
  },
  textSecondary: {
    color: Colors.onSurface,
    fontWeight: '600',
  },
  textOutline: {
    color: Colors.onSurface,
    fontWeight: '600',
  },
  textDanger: {
    color: Colors.onErrorContainer,
    fontWeight: '700',
  },
  textSunken: {
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});
