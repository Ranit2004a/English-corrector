import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, NeuShadows, Radius } from '../../constants/theme';

interface AudioWaveformProps {
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ active = false, style }) => {
  const [heights, setHeights] = useState<number[]>([6, 12, 20, 14, 8, 16, 24, 12, 6]);

  useEffect(() => {
    if (!active) {
      setHeights([6, 12, 20, 14, 8, 16, 24, 12, 6]);
      return;
    }

    const interval = setInterval(() => {
      setHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 22) + 6)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <View style={[styles.container, style]}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: h,
              backgroundColor: active
                ? (i % 2 === 0 ? Colors.primaryAccent : Colors.primary)
                : Colors.mutedLight,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 5,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    ...NeuShadows.sunken,
    alignSelf: 'center',
  },
  bar: {
    width: 4,
    borderRadius: Radius.full,
  },
});
