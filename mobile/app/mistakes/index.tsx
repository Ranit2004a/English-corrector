import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { CorrectionRepository } from '../../db/repositories/correctionRepository';
import { Correction, CorrectionCategory } from '../../types';
import { CorrectionCard } from '../../components/feedback/CorrectionCard';
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
        list = all.filter(c => c.severity === 'important');
      } else {
        list = await CorrectionRepository.getAllCorrections(selectedFilter as CorrectionCategory);
      }

      // If empty on first run, provide starter demo corrections for visual preview
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
          }
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Mistake History</Text>
          <Text style={styles.subtitle}>{corrections.length} recorded items</Text>
        </View>
      </View>

      {/* Filter Chips Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {FILTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.8}
            onPress={() => setSelectedFilter(opt)}
            style={[
              styles.chip,
              selectedFilter === opt && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                selectedFilter === opt && styles.chipTextActive,
              ]}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  filterBar: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  chipTextActive: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Spacing.margin,
    paddingBottom: 40,
    gap: 8,
  },
});
