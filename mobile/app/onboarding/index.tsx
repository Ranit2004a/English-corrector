import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { CEFRLevel, LearningGoal } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { NeuCard } from '../../components/ui/NeuCard';
import { ArrowRight, Check, Mic, Sparkles, BookOpen, Target, Award } from 'lucide-react-native';

const LEVELS: { level: CEFRLevel; title: string; desc: string }[] = [
  { level: 'A1', title: 'Beginner A1', desc: 'Basic greetings, simple phrases, and familiar everyday words.' },
  { level: 'A2', title: 'Elementary A2', desc: 'Routine conversations, basic descriptions, and simple questions.' },
  { level: 'B1', title: 'Intermediate B1', desc: 'Everyday topics, personal opinions, work, and storytelling.' },
  { level: 'B2', title: 'Upper Intermediate B2', desc: 'Spontaneous conversations, detailed arguments, and discussions.' },
  { level: 'C1', title: 'Advanced C1', desc: 'Nuanced, fluent, and idiomatic expression across subjects.' },
  { level: 'C2', title: 'Mastery C2', desc: 'Effortless native-like fluency, tone precision, and depth.' },
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
      await saveUser(name.trim() || 'Learner', selectedLevel, selectedGoal, dailyMinutes);
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Step Progress bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progressPercent} height={6} color={Colors.primaryAccent} />
          <Text style={styles.stepText}>STEP {step} OF {totalSteps}</Text>
        </View>

        {/* STEP 1: Welcome & Name */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <Sparkles size={28} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.stepTitle}>Welcome to Echo</Text>
            <Text style={styles.stepSubtitle}>
              Your tactile, private, AI English speaking coach.
            </Text>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>WHAT SHOULD WE CALL YOU?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.muted}
                />
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Choose English Level */}
        {step === 2 && (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Choose your level</Text>
            <Text style={styles.stepSubtitle}>
              Echo adapts vocabulary and conversation pacing to your target fluency.
            </Text>

            <View style={styles.optionsList}>
              {LEVELS.map((item) => {
                const isSelected = selectedLevel === item.level;
                return (
                  <TouchableOpacity
                    key={item.level}
                    activeOpacity={0.85}
                    style={[
                      styles.optionCard,
                      isSelected ? styles.optionCardSelected : styles.optionCardIdle,
                    ]}
                    onPress={() => setSelectedLevel(item.level)}
                  >
                    <View style={styles.optionHeader}>
                      <Text
                        style={[
                          styles.optionTitle,
                          isSelected && styles.optionTitleSelected,
                        ]}
                      >
                        {item.title}
                      </Text>
                      {isSelected && <Check size={18} color={Colors.primaryAccent} />}
                    </View>
                    <Text
                      style={[
                        styles.optionDesc,
                        isSelected && styles.optionDescSelected,
                      ]}
                    >
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
              We will suggest dialogue scenarios tailored to what matters most to you.
            </Text>

            <View style={styles.optionsList}>
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal;
                return (
                  <TouchableOpacity
                    key={goal}
                    activeOpacity={0.85}
                    style={[
                      styles.goalCard,
                      isSelected ? styles.goalCardSelected : styles.goalCardIdle,
                    ]}
                    onPress={() => setSelectedGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalText,
                        isSelected && styles.goalTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                    {isSelected && <Check size={18} color={Colors.primaryAccent} />}
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
              <Target size={28} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.stepTitle}>Daily Speaking Goal</Text>
            <Text style={styles.stepSubtitle}>
              Consistency creates confidence. How many minutes would you like to speak each day?
            </Text>

            <View style={styles.dailyGrid}>
              {DAILY_GOALS.map((mins) => {
                const isSelected = dailyMinutes === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    activeOpacity={0.8}
                    style={[
                      styles.dailyChip,
                      isSelected ? styles.dailyChipSelected : styles.dailyChipIdle,
                    ]}
                    onPress={() => setDailyMinutes(mins)}
                  >
                    <Text
                      style={[
                        styles.dailyChipNumber,
                        isSelected && styles.dailyChipNumberSelected,
                      ]}
                    >
                      {mins}
                    </Text>
                    <Text
                      style={[
                        styles.dailyChipUnit,
                        isSelected && styles.dailyChipUnitSelected,
                      ]}
                    >
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
            variant="accent"
            size="lg"
            icon={<ArrowRight size={18} color={Colors.onPrimaryAccent} />}
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
    paddingTop: Spacing.xs,
  },
  stepText: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepContent: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  stepSubtitle: {
    ...Typography.bodyMd,
    color: Colors.secondary,
    marginTop: 6,
    lineHeight: 22,
  },
  inputBlock: {
    marginTop: 28,
    gap: 8,
  },
  inputLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inputContainer: {
    ...NeuShadows.sunken,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
  },
  nameInput: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  optionsList: {
    marginTop: 20,
    gap: 12,
    paddingBottom: 24,
  },
  optionCard: {
    padding: 16,
    borderRadius: Radius.lg,
    gap: 4,
  },
  optionCardIdle: {
    ...NeuShadows.raisedSm,
  },
  optionCardSelected: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    ...Typography.labelLg,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  optionTitleSelected: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  optionDesc: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  optionDescSelected: {
    color: Colors.onSurfaceVariant,
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: Radius.lg,
  },
  goalCardIdle: {
    ...NeuShadows.raisedSm,
  },
  goalCardSelected: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  goalText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  goalTextSelected: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  dailyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  dailyChip: {
    width: '48%',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: Radius.lg,
    gap: 4,
  },
  dailyChipIdle: {
    ...NeuShadows.raisedSm,
  },
  dailyChipSelected: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  dailyChipNumber: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  dailyChipNumberSelected: {
    color: Colors.primaryAccent,
  },
  dailyChipUnit: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  dailyChipUnitSelected: {
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  footer: {
    paddingVertical: Spacing.md,
  },
});
