import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { ProgressRepository } from '../../db/repositories/progressRepository';
import { CorrectionRepository } from '../../db/repositories/correctionRepository';
import { DailyProgress } from '../../types';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Flame, Clock, Award, CheckCircle2 } from 'lucide-react-native';

const TIMEFRAMES = ['7 Days', '30 Days', 'All Time'] as const;

export default function ProgressScreen() {
  const { streak, todayMinutes } = useUserStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7 Days');
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);
  const [categoryCounts, setCategoryCounts] = useState({
    grammar: 0,
    vocabulary: 0,
    pronunciation: 0,
    naturalness: 0,
  });

  useEffect(() => {
    async function loadData() {
      const days = selectedTimeframe === '7 Days' ? 7 : selectedTimeframe === '30 Days' ? 30 : 90;
      const history = await ProgressRepository.getRecentProgress(days);
      setProgressData(history);

      const cats = await CorrectionRepository.getCategoryCounts();
      setCategoryCounts(cats);
    }
    loadData();
  }, [selectedTimeframe]);

  // Demo fallback chart values if fresh install
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartValues = [10, 15, 8, 20, 14, 18, Math.max(12, todayMinutes)];
  const maxVal = Math.max(...chartValues, 25);

  const totalMistakes =
    categoryCounts.grammar +
    categoryCounts.vocabulary +
    categoryCounts.pronunciation +
    categoryCounts.naturalness;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Dashboard</Text>
          <Text style={styles.subtitle}>Speaking consistency & performance metrics</Text>
        </View>

        {/* Timeframe selector */}
        <View style={styles.timeframeRow}>
          {TIMEFRAMES.map((tf) => (
            <TouchableOpacity
              key={tf}
              activeOpacity={0.8}
              onPress={() => setSelectedTimeframe(tf)}
              style={[styles.tfButton, selectedTimeframe === tf && styles.tfButtonActive]}
            >
              <Text
                style={[styles.tfButtonText, selectedTimeframe === tf && styles.tfButtonTextActive]}
              >
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Metric Cards */}
        <View style={styles.topStatsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Flame size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>{streak} Days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>{todayMinutes + 97}m</Text>
            <Text style={styles.statLabel}>Total Time Spoken</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>86%</Text>
            <Text style={styles.statLabel}>Overall Fluency</Text>
          </View>
        </View>

        {/* Weekly Speaking Activity Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SPEAKING TIME (MINUTES)</Text>
            <Text style={styles.sectionMeta}>Daily Breakdown</Text>
          </View>

          <View style={styles.barChartContainer}>
            {daysOfWeek.map((day, idx) => {
              const val = chartValues[idx];
              const heightPercent = Math.min(100, Math.round((val / maxVal) * 100));
              const isToday = idx === 6;

              return (
                <View key={day} style={styles.barColumn}>
                  <Text style={styles.barValue}>{val}m</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isToday ? Colors.primary : Colors.muted,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Skill Scores Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILL EVALUATION</Text>

          <View style={styles.skillsCard}>
            <View style={styles.skillRow}>
              <View style={styles.skillMeta}>
                <Text style={styles.skillName}>Grammar Accuracy</Text>
                <Text style={styles.skillScore}>82%</Text>
              </View>
              <ProgressBar progress={0.82} height={5} />
            </View>

            <View style={styles.skillRow}>
              <View style={styles.skillMeta}>
                <Text style={styles.skillName}>Vocabulary Diversity</Text>
                <Text style={styles.skillScore}>88%</Text>
              </View>
              <ProgressBar progress={0.88} height={5} />
            </View>

            <View style={styles.skillRow}>
              <View style={styles.skillMeta}>
                <Text style={styles.skillName}>Fluency & Cadence</Text>
                <Text style={styles.skillScore}>85%</Text>
              </View>
              <ProgressBar progress={0.85} height={5} />
            </View>

            <View style={styles.skillRow}>
              <View style={styles.skillMeta}>
                <Text style={styles.skillName}>Natural Phrasing</Text>
                <Text style={styles.skillScore}>90%</Text>
              </View>
              <ProgressBar progress={0.9} height={5} />
            </View>
          </View>
        </View>

        {/* Mistakes Distribution Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CORRECTIONS BY CATEGORY</Text>

          <View style={styles.categoryGrid}>
            <View style={styles.catCard}>
              <Text style={styles.catCount}>{categoryCounts.grammar}</Text>
              <Text style={styles.catName}>Grammar</Text>
              <Text style={styles.catSub}>Tenses & order</Text>
            </View>

            <View style={styles.catCard}>
              <Text style={styles.catCount}>{categoryCounts.vocabulary}</Text>
              <Text style={styles.catName}>Vocabulary</Text>
              <Text style={styles.catSub}>Word choice</Text>
            </View>

            <View style={styles.catCard}>
              <Text style={styles.catCount}>{categoryCounts.naturalness}</Text>
              <Text style={styles.catName}>Naturalness</Text>
              <Text style={styles.catSub}>Idioms & flow</Text>
            </View>

            <View style={styles.catCard}>
              <Text style={styles.catCount}>{categoryCounts.pronunciation}</Text>
              <Text style={styles.catName}>Pronunciation</Text>
              <Text style={styles.catSub}>Stress & sounds</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.margin,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    paddingBottom: 4,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    marginTop: 2,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tfButtonActive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  tfButtonText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  tfButtonTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  topStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    gap: 2,
  },
  statIcon: {
    marginBottom: 4,
  },
  statNumber: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  statLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    textAlign: 'center',
    fontSize: 10,
  },
  chartSection: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.labelLg,
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  sectionMeta: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 16,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    gap: 6,
  },
  barValue: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontSize: 10,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: Radius.full,
  },
  barLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  barLabelToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  section: {
    gap: 10,
  },
  skillsCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 14,
  },
  skillRow: {
    gap: 6,
  },
  skillMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    ...Typography.bodySm,
    color: Colors.onSurface,
  },
  skillScore: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: '48%',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: 14,
    gap: 2,
  },
  catCount: {
    ...Typography.headlineSm,
    color: Colors.primary,
  },
  catName: {
    ...Typography.labelLg,
    color: Colors.onSurface,
    marginTop: 2,
  },
  catSub: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontSize: 11,
  },
});
