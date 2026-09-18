import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { ProgressRepository } from '../../db/repositories/progressRepository';
import { DailyProgress } from '../../types';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { NeuCard } from '../../components/ui/NeuCard';
import { SkillRadarChart } from '../../components/ui/SkillRadarChart';
import { ActivityHeatmap } from '../../components/ui/ActivityHeatmap';
import { Flame, Clock, Award, TrendingUp, Sparkles } from 'lucide-react-native';

const TIMEFRAMES = ['7 Days', '30 Days', 'All Time'] as const;

export default function ProgressScreen() {
  const { streak, todayMinutes, dailyGoal } = useUserStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7 Days');
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);

  useEffect(() => {
    async function loadData() {
      const days = selectedTimeframe === '7 Days' ? 7 : selectedTimeframe === '30 Days' ? 30 : 365;
      const history = await ProgressRepository.getRecentProgress(days);
      setProgressData(history);
    }
    loadData();
  }, [selectedTimeframe]);

  /**
   * Timeframe Aggregated Mastery Scores:
   * Aggregates stored DailyProgress records (grammar_score, vocabulary_score, pronunciation_score, fluency_score).
   */
  const aggregatedScores = React.useMemo(() => {
    if (!progressData || progressData.length === 0) {
      return {
        grammar: 80,
        vocabulary: 80,
        pronunciation: 80,
        fluency: 80,
        naturalness: 82,
      };
    }

    const activeRecords = progressData.filter((d) => d.sessions_completed > 0 || d.speaking_minutes > 0);
    const targetSet = activeRecords.length > 0 ? activeRecords : progressData;

    const sum = targetSet.reduce(
      (acc, item) => ({
        grammar: acc.grammar + (item.grammar_score ?? 80),
        vocabulary: acc.vocabulary + (item.vocabulary_score ?? 80),
        pronunciation: acc.pronunciation + (item.pronunciation_score ?? 80),
        fluency: acc.fluency + (item.fluency_score ?? 80),
      }),
      { grammar: 0, vocabulary: 0, pronunciation: 0, fluency: 0 }
    );

    const count = targetSet.length || 1;

    const grammar = Math.round(sum.grammar / count);
    const vocabulary = Math.round(sum.vocabulary / count);
    const pronunciation = Math.round(sum.pronunciation / count);
    const fluency = Math.round(sum.fluency / count);
    const naturalness = Math.round((fluency * 0.6 + vocabulary * 0.4));

    return {
      grammar,
      vocabulary,
      pronunciation,
      fluency,
      naturalness,
    };
  }, [progressData]);

  // Timeframe aggregated speaking minutes
  const totalSpeakingMinutes = React.useMemo(() => {
    if (!progressData || progressData.length === 0) return todayMinutes;
    const sum = progressData.reduce((acc, curr) => acc + (curr.speaking_minutes || 0), 0);
    return Math.max(sum, todayMinutes);
  }, [progressData, todayMinutes]);

  // Timeframe aggregated mistake notes count
  const totalMistakes = React.useMemo(() => {
    if (!progressData || progressData.length === 0) return 0;
    return progressData.reduce((acc, curr) => acc + (curr.mistakes_count || 0), 0);
  }, [progressData]);

  // Dynamic 7-day practice chart data mapped from DailyProgress history
  const chartData = React.useMemo(() => {
    const days: { day: string; minutes: number; isToday: boolean }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const record = progressData.find((p) => p.date === dateStr);
      let minutes = record ? record.speaking_minutes : 0;
      if (i === 0) {
        minutes = Math.max(minutes, todayMinutes);
      }
      days.push({
        day: dayName,
        minutes,
        isToday: i === 0,
      });
    }
    return days;
  }, [progressData, todayMinutes]);

  const maxVal = Math.max(...chartData.map((d) => d.minutes), 25);

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
            <Text style={styles.statNumber}>{totalSpeakingMinutes}m</Text>
            <Text style={styles.statLabel}>Time Spoken</Text>
          </NeuCard>

          <NeuCard variant="raisedSm" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={20} color={Colors.success} />
            </View>
            <Text style={styles.statNumber}>{aggregatedScores.fluency}%</Text>
            <Text style={styles.statLabel}>Fluency Score</Text>
          </NeuCard>
        </View>

        {/* 1. Interactive 5-Axis CEFR Skill Radar Chart */}
        <SkillRadarChart scores={aggregatedScores} size={290} />

        {/* 2. Monthly Speaking Activity Heatmap */}
        <ActivityHeatmap
          progressData={progressData}
          daysCount={28}
          dailyGoalMinutes={dailyGoal || 15}
        />

        {/* 3. Speaking Practice Bar Chart */}
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
            {chartData.map((item) => {
              const heightPct = Math.round((item.minutes / maxVal) * 100);

              return (
                <View key={item.day} style={styles.chartCol}>
                  <Text style={styles.barValText}>{item.minutes > 0 ? `${item.minutes}m` : ''}</Text>
                  <View style={styles.barSlot}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                        item.isToday && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, item.isToday && styles.dayLabelToday]}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </NeuCard>

        {/* 4. Detailed Skill Area Progress */}
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
                <Text style={styles.breakdownCount}>{aggregatedScores.grammar}%</Text>
              </View>
              <ProgressBar progress={aggregatedScores.grammar} max={100} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Vocabulary */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Vocabulary Range</Text>
                <Text style={styles.breakdownCount}>{aggregatedScores.vocabulary}%</Text>
              </View>
              <ProgressBar progress={aggregatedScores.vocabulary} max={100} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Pronunciation */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Pronunciation & Clarity</Text>
                <Text style={styles.breakdownCount}>{aggregatedScores.pronunciation}%</Text>
              </View>
              <ProgressBar progress={aggregatedScores.pronunciation} max={100} height={8} color={Colors.primaryAccent} />
            </View>

            {/* Naturalness */}
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownName}>Natural Idiomatic Flow</Text>
                <Text style={styles.breakdownCount}>{aggregatedScores.naturalness}%</Text>
              </View>
              <ProgressBar progress={aggregatedScores.naturalness} max={100} height={8} color={Colors.primaryAccent} />
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
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
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
