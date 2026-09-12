import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { usePracticeStore } from '../../store/usePracticeStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Award, Sparkles, BookOpen, ArrowRight } from 'lucide-react-native';

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
    grammar_score: 82,
    vocabulary_score: 85,
    fluency_score: 88,
    overall_score: 85,
    top_improvement: 'Use present perfect continuous for actions that started in past and continue now.',
    new_words: ['opportunity', 'perspective', 'flexible', 'articulate'],
    encouragement: 'Great job speaking naturally and keeping a steady rhythm throughout the conversation!',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Celebration */}
        <View style={styles.heroSection}>
          <View style={styles.checkCircle}>
            <CheckCircle size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Great session!</Text>
          <Text style={styles.heroSubtitle}>
            You spoke for <Text style={styles.heroBold}>{summary.duration_minutes} minutes</Text> across {summary.messages_count} dialogue exchanges.
          </Text>
        </View>

        {/* Performance Scores Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SESSION EVALUATION</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Grammar Accuracy</Text>
              <Text style={styles.scoreValue}>{summary.grammar_score}%</Text>
            </View>
            <ProgressBar progress={summary.grammar_score / 100} height={6} />
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Vocabulary Diversity</Text>
              <Text style={styles.scoreValue}>{summary.vocabulary_score}%</Text>
            </View>
            <ProgressBar progress={summary.vocabulary_score / 100} height={6} />
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreMeta}>
              <Text style={styles.scoreLabel}>Fluency & Flow</Text>
              <Text style={styles.scoreValue}>{summary.fluency_score}%</Text>
            </View>
            <ProgressBar progress={summary.fluency_score / 100} height={6} />
          </View>
        </View>

        {/* Top Improvement Area */}
        <View style={styles.improvementCard}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color={Colors.primary} />
            <Text style={styles.improvementHeader}>TOP THING TO IMPROVE</Text>
          </View>
          <Text style={styles.improvementText}>{summary.top_improvement}</Text>
        </View>

        {/* Discovered Vocabulary Words */}
        {summary.new_words && summary.new_words.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>NEW VOCABULARY DISCOVERED</Text>
            </View>
            <View style={styles.vocabGrid}>
              {summary.new_words.map((w, idx) => (
                <View key={idx} style={styles.vocabChip}>
                  <Text style={styles.vocabText}>{w}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Encouraging Note */}
        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementText}>"{summary.encouragement}"</Text>
          <Text style={styles.coachSignature}>— Echo AI Speaking Coach</Text>
        </View>

        {/* Action Button */}
        <Button
          title="Back to Dashboard"
          onPress={handleDone}
          size="lg"
          icon={<ArrowRight size={18} color={Colors.onPrimary} />}
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
  },
  heroSubtitle: {
    ...Typography.bodyMd,
    color: Colors.muted,
    textAlign: 'center',
  },
  heroBold: {
    color: Colors.primary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...Typography.labelLg,
    color: Colors.muted,
    textTransform: 'uppercase',
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
  },
  scoreValue: {
    ...Typography.labelLg,
    color: Colors.primary,
  },
  improvementCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 8,
  },
  improvementHeader: {
    ...Typography.labelLg,
    color: Colors.primary,
    textTransform: 'uppercase',
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
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  vocabText: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontWeight: '600',
  },
  encouragementCard: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surfaceCard,
    gap: 6,
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
