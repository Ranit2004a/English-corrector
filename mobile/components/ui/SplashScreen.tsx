import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Colors, NeuShadows, Radius, Typography } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
  isReady?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isReady = true }) => {
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Subtle breathing pulse for the logo
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 2. Minimum display time before completing
    const timer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        pulseLoop.stop();
        if (onFinish) {
          onFinish();
        }
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Background Soft Ambient Light */}
      <View style={styles.ambientGlow} />

      <View style={styles.content}>
        {/* Animated Logo Container */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseAnim) },
              ],
            },
          ]}
        >
          <View style={styles.logoCard}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Animated Brand Typography */}
        <Animated.View
          style={[
            styles.textWrapper,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>TalkTune</Text>
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>AI Speaking & Fluency Coach</Text>
          </View>
        </Animated.View>
      </View>

      {/* Footer Info */}
      <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
        <Text style={styles.footerText}>Speak with Confidence</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: Colors.surfaceSubtle,
    opacity: 0.8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 28,
  },
  logoCard: {
    width: 130,
    height: 130,
    borderRadius: 36,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...NeuShadows.raisedLg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  textWrapper: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  taglineBadge: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  taglineText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    letterSpacing: 0.2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
