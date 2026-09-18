import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleProp,
  Animated,
} from 'react-native';
import { Radius, Typography } from '../../constants/theme';
import { useTheme } from '../../constants/useTheme';
import { HapticService } from '../../services/haptics';

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
  const { colors, shadows, isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getContainerStyle = () => {
    let variantBgAndBorder: any;
    let variantShadow: any;

    switch (variant) {
      case 'accent':
        variantShadow = shadows.accentRaised;
        variantBgAndBorder = {
          backgroundColor: colors.primaryAccent,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.35)',
          borderWidth: 1,
        };
        break;
      case 'secondary':
        variantShadow = shadows.raisedSm;
        variantBgAndBorder = {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        };
        break;
      case 'outline':
        variantShadow = shadows.raisedSm;
        variantBgAndBorder = {
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 1.5,
          borderColor: colors.neuDark,
        };
        break;
      case 'danger':
        variantShadow = shadows.raisedSm;
        variantBgAndBorder = {
          backgroundColor: colors.errorContainer,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.8)',
        };
        break;
      case 'sunken':
        variantShadow = shadows.sunken;
        variantBgAndBorder = {
          backgroundColor: colors.surfaceSunken,
          borderWidth: 1,
          borderColor: colors.neuSunkenBorder,
        };
        break;
      default:
        // Primary
        variantShadow = shadows.raised;
        variantBgAndBorder = {
          backgroundColor: colors.primary,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.25)',
          borderWidth: 1,
        };
        break;
    }

    if (isPressed) {
      return [shadows.sunken, variantBgAndBorder, { transform: [{ translateY: 1 }] }];
    }

    return [variantShadow, variantBgAndBorder];
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'accent':
        return { color: colors.onPrimaryAccent, fontWeight: '700' as const };
      case 'secondary':
        return { color: colors.onSurface, fontWeight: '600' as const };
      case 'outline':
        return { color: colors.onSurface, fontWeight: '600' as const };
      case 'danger':
        return { color: colors.onErrorContainer, fontWeight: '700' as const };
      case 'sunken':
        return { color: colors.onSurfaceVariant, fontWeight: '600' as const };
      default:
        return { color: colors.onPrimary, fontWeight: '700' as const };
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
    if (variant === 'danger') {
      return colors.onErrorContainer;
    }
    if (variant === 'secondary' || variant === 'outline' || variant === 'sunken') {
      return colors.onSurface;
    }
    return colors.onPrimary;
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    setIsPressed(true);
    HapticService.impactLight();
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1.0,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    </Animated.View>
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
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    ...Typography.labelLg,
  },
});
