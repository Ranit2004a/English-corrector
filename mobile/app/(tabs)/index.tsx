import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { NeuCard } from '../../components/ui/NeuCard';
import {
  Flame,
  Mic,
  ArrowRight,
  Sun,
  Briefcase,
  Plane,
  Coffee,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, streak, todayMinutes, dailyGoal, refreshProgress } = useUserStore();
  const startSession = usePracticeStore((state) => state.startSession);

  useEffect(() => {
    refreshProgress();
  }, []);

  const progressPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoal)) * 100));
  const remainingMins = Math.max(0, dailyGoal - todayMinutes);

  const handleStartDailySpeaking = async () => {
    const level = user?.level || 'B1';
    await startSession(
      'Daily Conversation',
      level,
      "Hey! How was your day today? Tell me what you've been up to."
    );
    router.push('/practice/session');
  };

  const handleStartTopic = async (topicTitle: string, starterPrompt: string) => {
    const level = user?.level || 'B1';
    await startSession(topicTitle, level, starterPrompt);
    router.push('/practice/session');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'Friend'}</Text>
              <View style={styles.levelRow}>
                <Text style={styles.subtitle}>Target: </Text>
                <Badge label={user?.level || 'B1'} variant="accent" />
              </View>
            </View>
          </View>

          {/* Streak Indicator */}
          <View style={styles.streakBadge}>
            <Flame size={18} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.streakText}>{streak} DAYS</Text>
          </View>
        </View>

        {/* Today's Goal (Extruded Card) */}
        <NeuCard variant="raised" style={styles.goalCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S GOAL</Text>
            <Text style={styles.goalCount}>
              <Text style={styles.goalBold}>{todayMinutes}</Text> / {dailyGoal} mins
            </Text>
          </View>

          <ProgressBar progress={progressPercent} height={10} color={Colors.primaryAccent} />

          <View style={styles.goalMetaRow}>
            <Text style={styles.goalMetaText}>
              {remainingMins > 0 ? `${remainingMins} mins left to complete goal` : 'Goal achieved today!'}
            </Text>
            <Text style={styles.goalMetaPercent}>{progressPercent}%</Text>
          </View>
        </NeuCard>

        {/* Primary CTA: Daily Conversation Hero Card */}
        <NeuCard variant="raisedLg" style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <View style={styles.micCircle}>
              <Mic size={22} color={Colors.primaryAccent} />
            </View>
            <Badge label="Recommended" variant="accent" />
          </View>

          <View style={styles.dailyCardBody}>
            <Text style={styles.dailyCardTitle}>Daily Speaking Practice</Text>
            <Text style={styles.dailyCardSubtitle}>
              5 minutes of realistic, natural speaking with instant pronunciation & grammar corrections.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleStartDailySpeaking}
            style={styles.dailyButton}
          >
            <Text style={styles.dailyButtonText}>Start session (5 min)</Text>
            <ArrowRight size={18} color={Colors.onPrimaryAccent} />
          </TouchableOpacity>
        </NeuCard>

        {/* Weekly Activity Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACTIVITY SNAPSHOT</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/progress')}>
              <Text style={styles.viewAllText}>Full Radar & Heatmap →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricGrid}>
            <NeuCard
              variant="raisedSm"
              style={styles.metricCol}
              onPress={() => router.push('/(tabs)/progress')}
            >
              <Text style={styles.metricLabel}>Time Spoken</Text>
              <Text style={styles.metricValue}>{todayMinutes + 45}m</Text>
              <Text style={styles.metricSub}>this week</Text>
            </NeuCard>

            <NeuCard
              variant="raisedSm"
              style={styles.metricCol}
              onPress={() => router.push('/(tabs)/progress')}
            >
              <Text style={styles.metricLabel}>Fluency</Text>
              <Text style={styles.metricValue}>88%</Text>
              <Text style={styles.metricSub}>Consistent</Text>
            </NeuCard>

            <NeuCard
              variant="raisedSm"
              style={styles.metricCol}
              onPress={() => router.push('/(tabs)/progress')}
            >
              <Text style={styles.metricLabel}>Streak</Text>
              <Text style={styles.metricValue}>{streak}d</Text>
              <Text style={styles.metricSub}>Active</Text>
            </NeuCard>
          </View>
        </View>

        {/* Suggested Topics Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUGGESTED TOPICS</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/practice')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topicGrid}>
            {/* Topic 1 */}
            <NeuCard
              variant="raised"
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Daily Life',
                  'Tell me, what did you do this morning right after waking up?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Sun size={20} color={Colors.primaryAccent} />
              </View>
              <Text style={styles.topicTitle}>Daily Life</Text>
              <Text style={styles.topicSubtitle}>Routines & habits</Text>
            </NeuCard>

            {/* Topic 2 */}
            <NeuCard
              variant="raised"
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Job Interview',
                  'Welcome! Could you introduce yourself and describe your past experiences?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Briefcase size={20} color={Colors.primaryAccent} />
              </View>
              <Text style={styles.topicTitle}>Job Interview</Text>
              <Text style={styles.topicSubtitle}>Pitch & stories</Text>
            </NeuCard>

            {/* Topic 3 */}
            <NeuCard
              variant="raised"
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Travel & Cities',
                  'If you could visit any city in the world tomorrow, where would you go?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Plane size={20} color={Colors.primaryAccent} />
              </View>
              <Text style={styles.topicTitle}>Travel & Cities</Text>
              <Text style={styles.topicSubtitle}>Directions & culture</Text>
            </NeuCard>

            {/* Topic 4 */}
            <NeuCard
              variant="raised"
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Coffee & Culture',
                  'What is your favorite warm drink and where do you like having it?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Coffee size={20} color={Colors.primaryAccent} />
              </View>
              <Text style={styles.topicTitle}>Coffee & Culture</Text>
              <Text style={styles.topicSubtitle}>Ordering & casual</Text>
            </NeuCard>
          </View>
        </View>

        {/* Quick Hub Navigation Cards: Mistakes & Vocabulary */}
        <View style={styles.quickHubRow}>
          <NeuCard
            variant="raised"
            style={styles.hubCard}
            onPress={() => router.push('/mistakes')}
          >
            <View style={styles.hubHeader}>
              <View style={styles.hubIconCircle}>
                <AlertCircle size={20} color={Colors.error} />
              </View>
              <ArrowRight size={16} color={Colors.muted} />
            </View>
            <Text style={styles.hubTitle}>Mistake History</Text>
            <Text style={styles.hubSubtitle}>Review and fix recorded errors</Text>
          </NeuCard>

          <NeuCard
            variant="raised"
            style={styles.hubCard}
            onPress={() => router.push('/vocabulary')}
          >
            <View style={styles.hubHeader}>
              <View style={styles.hubIconCircle}>
                <BookOpen size={20} color={Colors.primaryAccent} />
              </View>
              <ArrowRight size={16} color={Colors.muted} />
            </View>
            <Text style={styles.hubTitle}>Vocabulary Bank</Text>
            <Text style={styles.hubSubtitle}>Saved words & idioms</Text>
          </NeuCard>
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
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: Spacing.margin,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    ...NeuShadows.raisedSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headlineSm,
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  greeting: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  subtitle: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    ...NeuShadows.raisedSm,
  },
  streakText: {
    ...Typography.labelSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  goalCard: {
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metaLabel: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  goalCount: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  goalBold: {
    fontWeight: '800',
    color: Colors.primaryAccent,
  },
  goalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalMetaText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  goalMetaPercent: {
    ...Typography.labelMd,
    fontWeight: '700',
    color: Colors.primaryAccent,
  },
  dailyCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dailyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  micCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyCardBody: {
    gap: 6,
  },
  dailyCardTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  dailyCardSubtitle: {
    ...Typography.bodySm,
    color: Colors.secondary,
    lineHeight: 20,
  },
  dailyButton: {
    ...NeuShadows.accentRaised,
    height: 52,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 6,
  },
  dailyButtonText: {
    ...Typography.labelLg,
    color: Colors.onPrimaryAccent,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCol: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '600',
  },
  metricValue: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
    marginVertical: 3,
  },
  metricSub: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  viewAllText: {
    ...Typography.labelMd,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    width: '48%',
    minWidth: 140,
    flexGrow: 1,
    gap: 8,
    padding: 16,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    ...Typography.headlineSm,
    fontSize: 16,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  topicSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontSize: 12,
  },
  quickHubRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  hubCard: {
    flex: 1,
    minWidth: 140,
    gap: 6,
    padding: 16,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hubIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  hubSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontSize: 12,
  },
});
