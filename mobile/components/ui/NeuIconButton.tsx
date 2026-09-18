import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import { Radius } from '../../constants/theme';
import { useTheme } from '../../constants/useTheme';
import { HapticService } from '../../services/haptics';

interface NeuIconButtonProps {
  icon: React.ReactNode;
  accessibilityLabel: string;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  rounded?: 'circle' | 'square';
  variant?: 'raised' | 'sunken' | 'accent' | 'danger';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const NeuIconButton: React.FC<NeuIconButtonProps> = ({
  icon,
  accessibilityLabel,
  onPress,
  size = 44,
  rounded = 'circle',
  variant = 'raised',
  style,
  disabled = false,
}) => {
  const { shadows, colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getVariantStyle = () => {
    if (isPressed) {
      return shadows.sunken;
    }
    switch (variant) {
      case 'sunken':
        return shadows.sunken;
      case 'accent':
        return shadows.accentRaised;
      case 'danger':
        return [
          shadows.raisedSm,
          { backgroundColor: colors.errorContainer, borderColor: 'rgba(255,255,255,0.8)' },
        ];
      default:
        return shadows.raisedSm;
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    setIsPressed(true);
    HapticService.impactLight();
    Animated.spring(scaleAnim, {
      toValue: 0.94,
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

  const borderRadius = rounded === 'circle' ? size / 2 : Radius.md;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.base,
          { width: size, height: size, borderRadius },
          getVariantStyle(),
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
