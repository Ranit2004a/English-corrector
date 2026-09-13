import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, NeuShadows, Radius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = Colors.primaryAccent,
  backgroundColor = Colors.surfaceSunken,
  style,
}) => {
  const normalized = Math.min(100, Math.max(0, progress > 1 ? progress : progress * 100));

  return (
    <View style={[styles.track, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${normalized}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.neuSunkenBorder,
    overflow: 'hidden',
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
