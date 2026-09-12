import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
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
              <Text style={styles.greeting}>Good day, {user?.name || 'Friend'}</Text>
              <View style={styles.levelRow}>
                <Text style={styles.subtitle}>Level: </Text>
                <Badge label={user?.level || 'B1'} variant="accent" />
              </View>
            </View>
          </View>

          {/* Streak Indicator */}
          <View style={styles.streakBadge}>
            <Flame size={16} color={Colors.primary} />
            <Text style={styles.streakText}>{streak} DAYS</Text>
          </View>
        </View>

        {/* Today's Goal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S GOAL</Text>
            <Text style={styles.goalCount}>
              <Text style={styles.goalBold}>{todayMinutes}</Text> / {dailyGoal} mins
            </Text>
          </View>

          <ProgressBar progress={progressPercent} height={6} />

          <View style={styles.goalMetaRow}>
            <Text style={styles.goalMetaText}>
              {remainingMins > 0 ? `${remainingMins} mins left to hit goal` : 'Daily goal completed!'}
            </Text>
            <Text style={styles.goalMetaPercent}>{progressPercent}%</Text>
          </View>
        </View>

        {/* Primary CTA: Daily Conversation Monolith Card */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <View style={styles.micCircle}>
              <Mic size={20} color={Colors.onPrimary} />
            </View>
            <Badge label="Recommended" variant="inverted" />
          </View>

          <View style={styles.dailyCardBody}>
            <Text style={styles.dailyCardTitle}>Daily Conversation</Text>
            <Text style={styles.dailyCardSubtitle}>
              Practice natural back-and-forth speaking tailored to your pace today.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleStartDailySpeaking}
            style={styles.dailyButton}
          >
            <Text style={styles.dailyButtonText}>Start speaking (5 min)</Text>
            <ArrowRight size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Weekly Activity Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACTIVITY SUMMARY</Text>
            <Text style={styles.metaLabel}>Recent</Text>
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Total Time</Text>
              <Text style={styles.metricValue}>{todayMinutes + 45}m</Text>
              <Text style={styles.metricSub}>this week</Text>
            </View>

            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Fluency</Text>
              <Text style={styles.metricValue}>86%</Text>
              <Text style={styles.metricSub}>Consistent</Text>
            </View>

            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Streak</Text>
              <Text style={styles.metricValue}>{streak}d</Text>
              <Text style={styles.metricSub}>Active</Text>
            </View>
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
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Daily Life',
                  'Tell me, what did you do this morning right after waking up?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Sun size={18} color={Colors.primary} />
              </View>
              <Text style={styles.topicTitle}>Daily Life</Text>
              <Text style={styles.topicSubtitle}>Morning routines & habits</Text>
            </TouchableOpacity>

            {/* Topic 2 */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Job Interview',
                  'Welcome! Could you introduce yourself and describe your past experiences?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Briefcase size={18} color={Colors.primary} />
              </View>
              <Text style={styles.topicTitle}>Job Interview</Text>
              <Text style={styles.topicSubtitle}>Role pitching & stories</Text>
            </TouchableOpacity>

            {/* Topic 3 */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Travel & Cities',
                  'If you could visit any city in the world tomorrow, where would you go?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Plane size={18} color={Colors.primary} />
              </View>
              <Text style={styles.topicTitle}>Travel & Cities</Text>
              <Text style={styles.topicSubtitle}>Asking directions & food</Text>
            </TouchableOpacity>

            {/* Topic 4 */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.topicCard}
              onPress={() =>
                handleStartTopic(
                  'Coffee & Culture',
                  'What is your favorite warm drink and where do you like having it?'
                )
              }
            >
              <View style={styles.topicIcon}>
                <Coffee size={18} color={Colors.primary} />
              </View>
              <Text style={styles.topicTitle}>Coffee & Culture</Text>
              <Text style={styles.topicSubtitle}>Ordering & casual chats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Hub Navigation Cards: Mistakes & Vocabulary */}
        <View style={styles.quickHubRow}>
          <TouchableOpacity
            style={styles.hubCard}
            activeOpacity={0.85}
            onPress={() => router.push('/mistakes')}
          >
            <View style={styles.hubHeader}>
              <AlertCircle size={20} color={Colors.primary} />
              <ArrowRight size={16} color={Colors.muted} />
            </View>
            <Text style={styles.hubTitle}>Mistake History</Text>
            <Text style={styles.hubSubtitle}>Review & fix past errors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hubCard}
            activeOpacity={0.85}
            onPress={() => router.push('/vocabulary')}
          >
            <View style={styles.hubHeader}>
              <BookOpen size={20} color={Colors.primary} />
              <ArrowRight size={16} color={Colors.muted} />
            </View>
            <Text style={styles.hubTitle}>Vocabulary Bank</Text>
            <Text style={styles.hubSubtitle}>Learned words & phrases</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.headlineSm,
    color: Colors.primary,
  },
  greeting: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  subtitle: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surfaceSubtle,
  },
  streakText: {
    ...Typography.labelSm,
    color: Colors.primary,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    ...Typography.labelLg,
    color: Colors.muted,
    textTransform: 'uppercase',
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
    fontWeight: '700',
    color: Colors.primary,
  },
  goalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  goalMetaText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  goalMetaPercent: {
    ...Typography.labelMd,
    fontWeight: '600',
    color: Colors.primary,
  },
  dailyCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  dailyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  micCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyCardBody: {
    gap: 4,
  },
  dailyCardTitle: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
  },
  dailyCardSubtitle: {
    ...Typography.bodySm,
    color: Colors.outlineVariant,
  },
  dailyButton: {
    backgroundColor: Colors.onPrimary,
    height: 46,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  dailyButtonText: {
    ...Typography.labelLg,
    color: Colors.primary,
  },
  metricGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  metricCol: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.outline,
  },
  metricLabel: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  metricValue: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginVertical: 2,
  },
  metricSub: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  viewAllText: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontWeight: '600',
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicCard: {
    width: '48%',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  topicTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
  },
  topicSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontSize: 12,
  },
  quickHubRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hubCard: {
    flex: 1,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surfaceSubtle,
    gap: 4,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hubTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
  },
  hubSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    fontSize: 11,
  },
});
