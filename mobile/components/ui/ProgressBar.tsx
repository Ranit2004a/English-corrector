import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color = Colors.primary,
  backgroundColor = Colors.surfaceContainer,
  style,
}) => {
  const normalized = Math.min(100, Math.max(0, progress > 1 ? progress : progress * 100));

  return (
    <View style={[styles.track, { height, backgroundColor }, style]}>
      <View style={[styles.fill, { width: `${normalized}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
