import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';
import { Colors, NeuShadows, Radius } from '../../constants/theme';

interface NeuIconButtonProps {
  icon: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  rounded?: 'circle' | 'square';
  variant?: 'raised' | 'sunken' | 'accent' | 'danger';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const NeuIconButton: React.FC<NeuIconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  rounded = 'circle',
  variant = 'raised',
  style,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyle = () => {
    if (isPressed) {
      return NeuShadows.sunken;
    }
    switch (variant) {
      case 'sunken':
        return NeuShadows.sunken;
      case 'accent':
        return NeuShadows.accentRaised;
      case 'danger':
        return [
          NeuShadows.raisedSm,
          { backgroundColor: Colors.errorContainer, borderColor: 'rgba(255,255,255,0.8)' },
        ];
      default:
        return NeuShadows.raisedSm;
    }
  };

  const borderRadius = rounded === 'circle' ? size / 2 : Radius.md;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
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
