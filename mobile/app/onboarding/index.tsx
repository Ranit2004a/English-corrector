import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { CEFRLevel, LearningGoal } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ArrowRight, Check, Mic, Sparkles, BookOpen, Target, Award } from 'lucide-react-native';

const LEVELS: { level: CEFRLevel; title: string; desc: string }[] = [
  { level: 'A1', title: 'Beginner A1', desc: 'Basic greetings, simple phrases, and familiar words.' },
  { level: 'A2', title: 'Elementary A2', desc: 'Routine conversations, basic descriptions, and shopping.' },
  { level: 'B1', title: 'Intermediate B1', desc: 'Everyday topics, personal opinions, and storytelling.' },
  { level: 'B2', title: 'Upper Intermediate B2', desc: 'Spontaneous conversations and professional discussions.' },
  { level: 'C1', title: 'Advanced C1', desc: 'Nuanced, fluent, and idiomatic expression across subjects.' },
  { level: 'C2', title: 'Mastery C2', desc: 'Effortless native-like fluency, precision, and tone.' },
];

const GOALS: LearningGoal[] = [
  'Everyday conversation',
  'Job interviews',
  'Professional English',
  'Travel English',
  'Academic English',
  'General fluency',
];

const DAILY_GOALS = [5, 10, 15, 20, 30];

export default function OnboardingScreen() {
  const router = useRouter();
  const saveUser = useUserStore((state) => state.saveUser);

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('Ranit');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('B1');
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>('Everyday conversation');
  const [dailyMinutes, setDailyMinutes] = useState<number>(15);

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save and finish onboarding
      await saveUser(name.trim() || 'Learner', selectedLevel, selectedGoal, dailyMinutes);
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Step Progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progressPercent / 100} height={4} />
          <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
        </View>

        {/* STEP 1: Welcome & Name */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <Sparkles size={28} color={Colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Welcome to Echo</Text>
            <Text style={styles.stepSubtitle}>
              Your dedicated, local-first AI English speaking partner.
            </Text>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>What should we call you?</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.muted}
              />
            </View>
          </View>
        )}

        {/* STEP 2: Choose English Level */}
        {step === 2 && (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Choose your level</Text>
            <Text style={styles.stepSubtitle}>
              Echo will adapt vocabulary and conversation complexity to your pace.
            </Text>

            <View style={styles.optionsList}>
              {LEVELS.map((item) => {
                const isSelected = selectedLevel === item.level;
                return (
                  <TouchableOpacity
                    key={item.level}
                    activeOpacity={0.85}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedLevel(item.level)}
                  >
                    <View style={styles.optionHeader}>
                      <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                        {item.title}
                      </Text>
                      {isSelected && <Check size={18} color={Colors.primary} />}
                    </View>
                    <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>
                      {item.desc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* STEP 3: Choose Learning Goal */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What is your primary goal?</Text>
            <Text style={styles.stepSubtitle}>
              We'll tailor suggested dialogue topics to what matters most to you.
            </Text>

            <View style={styles.optionsList}>
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    activeOpacity={0.85}
                    style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                    onPress={() => setSelectedGoal(goal)}
                  >
                    <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>
                      {goal}
                    </Text>
                    {isSelected && <Check size={18} color={Colors.onPrimary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 4: Daily Speaking Target */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <Target size={28} color={Colors.primary} />
            </View>
            <Text style={styles.stepTitle}>Daily Speaking Goal</Text>
            <Text style={styles.stepSubtitle}>
              Consistency is key to fluency. How many minutes would you like to speak each day?
            </Text>

            <View style={styles.dailyGrid}>
              {DAILY_GOALS.map((mins) => {
                const isSelected = dailyMinutes === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    activeOpacity={0.8}
                    style={[styles.dailyChip, isSelected && styles.dailyChipSelected]}
                    onPress={() => setDailyMinutes(mins)}
                  >
                    <Text style={[styles.dailyChipNumber, isSelected && styles.dailyChipNumberSelected]}>
                      {mins}
                    </Text>
                    <Text style={[styles.dailyChipUnit, isSelected && styles.dailyChipUnitSelected]}>
                      mins / day
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <Button
            title={step === totalSteps ? 'Start Practicing' : 'Continue'}
            onPress={handleNext}
            size="lg"
            icon={<ArrowRight size={18} color={Colors.onPrimary} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.margin,
    justifyContent: 'space-between',
  },
  progressContainer: {
    gap: 8,
    paddingTop: Spacing.sm,
  },
  stepText: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  stepContent: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
  },
  stepSubtitle: {
    ...Typography.bodyMd,
    color: Colors.muted,
    marginTop: 6,
    lineHeight: 22,
  },
  inputBlock: {
    marginTop: 28,
    gap: 8,
  },
  inputLabel: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  nameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    ...Typography.bodyLg,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceSubtle,
  },
  optionsList: {
    marginTop: 20,
    gap: 10,
    paddingBottom: 20,
  },
  optionCard: {
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.surfaceSubtle,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  optionDesc: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  optionDescSelected: {
    color: Colors.onSurface,
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  goalCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  goalTextSelected: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  dailyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 24,
  },
  dailyChip: {
    width: '48%',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    gap: 2,
  },
  dailyChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dailyChipNumber: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
  },
  dailyChipNumberSelected: {
    color: Colors.onPrimary,
  },
  dailyChipUnit: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  dailyChipUnitSelected: {
    color: Colors.outlineVariant,
  },
  footer: {
    paddingVertical: Spacing.md,
  },
});
