import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
} from 'react-native';
import { Radius } from '../../constants/theme';
import { useTheme } from '../../constants/useTheme';
import { HapticService } from '../../services/haptics';

interface NeuCardProps {
  children: React.ReactNode;
  variant?: 'raised' | 'raisedSm' | 'raisedLg' | 'sunken' | 'accent';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  variant = 'raised',
  onPress,
  style,
}) => {
  const { shadows } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getShadowStyle = () => {
    if (isPressed) {
      return shadows.sunken;
    }
    switch (variant) {
      case 'raisedSm':
        return shadows.raisedSm;
      case 'raisedLg':
        return shadows.raisedLg;
      case 'sunken':
        return shadows.sunken;
      case 'accent':
        return shadows.accentRaised;
      default:
        return shadows.raised;
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
    HapticService.impactLight();
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1.0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, getShadowStyle(), style, { transform: [{ scale: scaleAnim }] }]}
      >
        {children}
      </AnimatedTouchable>
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
