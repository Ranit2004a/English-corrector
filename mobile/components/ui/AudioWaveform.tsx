import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface AudioWaveformProps {
  active?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ active = false }) => {
  const [heights, setHeights] = useState<number[]>([6, 12, 20, 14, 8, 16, 24, 12, 6]);

  useEffect(() => {
    if (!active) {
      setHeights([6, 12, 20, 14, 8, 16, 24, 12, 6]);
      return;
    }

    const interval = setInterval(() => {
      setHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 20) + 6)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <View style={styles.container}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: h,
              backgroundColor: active ? (i % 2 === 0 ? Colors.primary : Colors.muted) : Colors.outlineVariant,
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
    height: 32,
    gap: 4,
    paddingHorizontal: 12,
  },
  bar: {
    width: 3,
    borderRadius: 99,
  },
});
