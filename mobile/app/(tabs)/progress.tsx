import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { ProgressRepository } from '../../db/repositories/progressRepository';
import { CorrectionRepository } from '../../db/repositories/correctionRepository';
import { DailyProgress } from '../../types';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { NeuCard } from '../../components/ui/NeuCard';
import { Flame, Clock, Award, CheckCircle2, TrendingUp } from 'lucide-react-native';

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

        {/* Timeframe Selector (Neumorphic Segmented Control) */}
        <View style={styles.timeframeContainer}>
          {TIMEFRAMES.map((tf) => {
            const isActive = selectedTimeframe === tf;
            return (
              <TouchableOpacity
                key={tf}
                activeOpacity={0.8}
                onPress={() => setSelectedTimeframe(tf)}
                style={[
                  styles.tfButton,
                  isActive ? styles.tfButtonActive : styles.tfButtonIdle,
                ]}
              >
                <Text
                  style={[
                    styles.tfButtonText,
                    isActive ? styles.tfButtonTextActive : styles.tfButtonTextIdle,
                  ]}
                >
                  {tf}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top Metric Cards */}
        <View style={styles.topStatsRow}>
          <NeuCard variant="raisedSm" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Flame size={20} color="#F59E0B" fill="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{streak} Days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </NeuCard>

          <NeuCard variant="raisedSm" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={20} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.statNumber}>{todayMinutes + 97}m</Text>
            <Text style={styles.statLabel}>Time Spoken</Text>
          </NeuCard>

          <NeuCard variant="raisedSm" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={20} color={Colors.success} />
            </View>
            <Text style={styles.statNumber}>86%</Text>
            <Text style={styles.statLabel}>Fluency Score</Text>
          </NeuCard>
        </View>

        {/* Speaking Practice Activity Chart */}
        <NeuCard variant="raised" style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <TrendingUp size={18} color={Colors.primaryAccent} />
              <Text style={styles.cardTitle}>PRACTICE MINUTES</Text>
            </View>
            <Text style={styles.cardMeta}>Daily Minutes</Text>
          </View>

          {/* Bar chart with sunken slots and extruded bars */}
          <View style={styles.chartContainer}>
            {daysOfWeek.map((day, idx) => {
              const val = chartValues[idx] || 0;
              const heightPct = Math.round((val / maxVal) * 100);
              const isToday = idx === daysOfWeek.length - 1;

              return (
                <View key={day} style={styles.chartCol}>
                  <Text style={styles.barValText}>{val > 0 ? `${val}m` : ''}</Text>
                  <View style={styles.barSlot}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                        isToday && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </NeuCard>

        {/* Mastery Breakdown */}
        <NeuCard variant="raised" style={styles.breakdownCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AREA ANALYSIS</Text>
            <Text style={styles.cardMeta}>{totalMistakes} recorded notes</Text>
          </View>

          <View style={styles.breakdownList}>
            {/* Grammar */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Grammar Accuracy</Text>
                <Text style={styles.breakdownCount}>84%</Text>
              </View>
              <ProgressBar progress={84} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Vocabulary */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Vocabulary Range</Text>
                <Text style={styles.breakdownCount}>78%</Text>
              </View>
              <ProgressBar progress={78} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Pronunciation */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Pronunciation & Clarity</Text>
                <Text style={styles.breakdownCount}>90%</Text>
              </View>
              <ProgressBar progress={90} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Naturalness */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Natural Idiomatic Flow</Text>
                <Text style={styles.breakdownCount}>74%</Text>
              </View>
              <ProgressBar progress={74} height={8} color={Colors.primaryAccent} />
            </View>
          </View>
        </NeuCard>
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
    paddingTop: Spacing.xs,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    marginTop: 2,
  },
  timeframeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfButtonIdle: {
    ...NeuShadows.raisedSm,
  },
  tfButtonActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  tfButtonText: {
    ...Typography.labelMd,
  },
  tfButtonTextIdle: {
    color: Colors.muted,
    fontWeight: '600',
  },
  tfButtonTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  topStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    textAlign: 'center',
  },
  chartCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardMeta: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 6,
  },
  barValText: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
  },
  barSlot: {
    width: 16,
    height: 90,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1,
    borderColor: Colors.neuSunkenBorder,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.neuDarkDeep,
  },
  barFillToday: {
    backgroundColor: Colors.primaryAccent,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  dayLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  dayLabelToday: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  breakdownCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  breakdownList: {
    gap: 14,
  },
  breakdownItem: {
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownName: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  breakdownCount: {
    ...Typography.labelMd,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
});
