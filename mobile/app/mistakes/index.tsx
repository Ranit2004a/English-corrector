import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { CorrectionRepository } from '../../db/repositories/correctionRepository';
import { Correction, CorrectionCategory } from '../../types';
import { CorrectionCard } from '../../components/feedback/CorrectionCard';
import { NeuIconButton } from '../../components/ui/NeuIconButton';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';

const FILTER_OPTIONS = ['All', 'grammar', 'vocabulary', 'pronunciation', 'naturalness', 'Important'] as const;

export default function MistakesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [corrections, setCorrections] = useState<Correction[]>([]);

  useEffect(() => {
    async function loadCorrections() {
      let list: Correction[];
      if (selectedFilter === 'All') {
        list = await CorrectionRepository.getAllCorrections();
      } else if (selectedFilter === 'Important') {
        const all = await CorrectionRepository.getAllCorrections();
        list = all.filter((c) => c.severity === 'important');
      } else {
        list = await CorrectionRepository.getAllCorrections(selectedFilter as CorrectionCategory);
      }

      if (list.length === 0) {
        list = [
          {
            id: 'corr_demo_1',
            original: 'I am working here since two years.',
            corrected: 'I have been working here for two years.',
            explanation: "Use 'for' with a duration, and present perfect continuous for actions continuing into the present.",
            category: 'grammar',
            severity: 'moderate',
            created_at: new Date().toISOString(),
          },
          {
            id: 'corr_demo_2',
            original: 'Yesterday I go to market and buy some fruits.',
            corrected: 'Yesterday I went to the market and bought some fruits.',
            explanation: 'Use simple past tense forms (went, bought) when recounting completed actions in the past.',
            category: 'grammar',
            severity: 'important',
            created_at: new Date().toISOString(),
          },
          {
            id: 'corr_demo_3',
            original: 'He explained me the whole situation.',
            corrected: 'He explained the whole situation to me.',
            explanation: "'Explain' takes a direct object followed by 'to' + person.",
            category: 'naturalness',
            severity: 'minor',
            created_at: new Date().toISOString(),
          },
        ];
      }
      setCorrections(list);
    }
    loadCorrections();
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <NeuIconButton
          icon={<ArrowLeft size={18} color={Colors.onSurface} />}
          accessibilityLabel="Go back"
          size={40}
          onPress={() => router.back()}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Mistake History</Text>
          <Text style={styles.subtitle}>{corrections.length} recorded items</Text>
        </View>
      </View>

      {/* Filter Chips Bar */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = selectedFilter === opt;
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(opt)}
                style={[
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipIdle,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive ? styles.chipTextActive : styles.chipTextIdle,
                  ]}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Mistakes List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {corrections.map((corr) => (
          <CorrectionCard key={corr.id} correction={corr} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    gap: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  filterContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    height: 54,
    marginVertical: 4,
    justifyContent: 'center',
  },
  filterBar: {
    paddingHorizontal: Spacing.margin,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    ...NeuShadows.raisedSm,
  },
  chipActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextIdle: {
    color: Colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  listContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: Spacing.margin,
    paddingBottom: 40,
    gap: 12,
  },
});
