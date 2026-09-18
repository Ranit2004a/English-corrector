import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { usePracticeStore } from '../../store/usePracticeStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { NeuCard } from '../../components/ui/NeuCard';
import { CheckCircle2, Sparkles, BookOpen, ArrowRight, Award } from 'lucide-react-native';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const { lastSummary, resetSession } = usePracticeStore();

  const handleDone = () => {
    resetSession();
    router.replace('/(tabs)');
  };

  const summary = lastSummary || {
    session_id: 'default',
    duration_minutes: 5,
    messages_count: 8,
    corrections_count: 2,
    grammar_score: 84,
    vocabulary_score: 86,
    fluency_score: 88,
    overall_score: 86,
    top_improvement: 'Use present perfect continuous for actions that started in past and continue into the present.',
    new_words: ['opportunity', 'perspective', 'flexible', 'articulate'],
    encouragement: 'Great job speaking naturally and keeping a steady conversational rhythm!',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Celebration */}
        <View style={styles.heroSection}>
          <View style={styles.checkCircle}>
            <CheckCircle2 size={36} color={Colors.success} />
          </View>
          <Text style={styles.heroTitle}>Great Practice Session!</Text>
          <Text style={styles.heroSubtitle}>
            You spoke for <Text style={styles.heroBold}>{summary.duration_minutes} minutes</Text> across{' '}
            {summary.messages_count} dialogue turns.
          </Text>
        </View>

        {/* Performance Evaluation Card */}
        <NeuCard variant="raised" style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={18} color={Colors.primaryAccent} />
            <Text style={styles.cardTitle}>SESSION EVALUATION</Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Grammar Accuracy</Text>
              <Text style={styles.scoreValue}>{summary.grammar_score}%</Text>
            </View>
            <ProgressBar progress={summary.grammar_score} max={100} height={8} color={Colors.primaryAccent} />
          </View>

          {/* Vocabulary Diversity */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Vocabulary Diversity</Text>
              <Text style={styles.scoreValue}>{summary.vocabulary_score}%</Text>
            </View>
            <ProgressBar progress={summary.vocabulary_score} max={100} height={8} color={Colors.primaryAccent} />
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Fluency & Flow</Text>
              <Text style={styles.scoreValue}>{summary.fluency_score}%</Text>
            </View>
            <ProgressBar progress={summary.fluency_score} max={100} height={8} color={Colors.success} />
          </View>
        </NeuCard>

        {/* Top Improvement Area */}
        <NeuCard variant="raised" style={styles.improvementCard}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color={Colors.primaryAccent} />
            <Text style={styles.improvementHeader}>KEY TAKEAWAY TO REMEMBER</Text>
          </View>
          <Text style={styles.improvementText}>{summary.top_improvement}</Text>
        </NeuCard>

        {/* Discovered Vocabulary Words */}
        {summary.new_words && summary.new_words.length > 0 && (
          <NeuCard variant="raised" style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={18} color={Colors.primaryAccent} />
              <Text style={styles.cardTitle}>NEW VOCABULARY</Text>
            </View>
            <View style={styles.vocabGrid}>
              {summary.new_words.map((w, idx) => (
                <View key={idx} style={styles.vocabChip}>
                  <Text style={styles.vocabText}>{w}</Text>
                </View>
              ))}
            </View>
          </NeuCard>
        )}

        {/* Encouraging Note */}
        <NeuCard variant="raisedSm" style={styles.encouragementCard}>
          <Text style={styles.encouragementText}>"{summary.encouragement}"</Text>
          <Text style={styles.coachSignature}>— TalkTune Speaking Coach</Text>
        </NeuCard>

        {/* Action Button */}
        <Button
          title="Back to Dashboard"
          onPress={handleDone}
          variant="accent"
          size="lg"
          icon={<ArrowRight size={18} color={Colors.onPrimaryAccent} />}
        />
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
  heroSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  heroSubtitle: {
    ...Typography.bodyMd,
    color: Colors.muted,
    textAlign: 'center',
  },
  heroBold: {
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  card: {
    padding: Spacing.lg,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scoreRow: {
    gap: 6,
  },
  scoreMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  scoreValue: {
    ...Typography.labelLg,
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  improvementCard: {
    padding: Spacing.lg,
    gap: 10,
  },
  improvementHeader: {
    ...Typography.labelSm,
    color: Colors.primaryAccent,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  improvementText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  vocabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vocabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    ...NeuShadows.raisedSm,
  },
  vocabText: {
    ...Typography.labelMd,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  encouragementCard: {
    padding: 16,
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
  },
  encouragementText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  coachSignature: {
    ...Typography.labelSm,
    color: Colors.muted,
    textAlign: 'right',
  },
});
