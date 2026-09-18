import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { VocabularyRepository } from '../../db/repositories/vocabularyRepository';
import { VocabularyItem } from '../../types';
import { TTSService } from '../../services/tts';
import { HapticService } from '../../services/haptics';
import { NeuIconButton } from '../../components/ui/NeuIconButton';
import { NeuCard } from '../../components/ui/NeuCard';
import { ArrowLeft, Volume2, CheckCircle2, Circle, BookOpen, Sparkles } from 'lucide-react-native';

export default function VocabularyScreen() {
  const router = useRouter();
  const [filterLearned, setFilterLearned] = useState<'all' | 'unlearned' | 'learned'>('all');
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);

  const loadData = async () => {
    let list: VocabularyItem[];
    if (filterLearned === 'learned') {
      list = await VocabularyRepository.getAllVocabulary(true);
    } else if (filterLearned === 'unlearned') {
      list = await VocabularyRepository.getAllVocabulary(false);
    } else {
      list = await VocabularyRepository.getAllVocabulary();
    }

    if (list.length === 0) {
      list = [
        {
          id: 'v1',
          word: 'Opportunity',
          meaning: 'A set of circumstances that makes it possible to do something.',
          example: 'This speaking practice is a great opportunity to build confidence.',
          learned: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'v2',
          word: 'Perspective',
          meaning: 'A particular attitude toward or way of regarding something; a point of view.',
          example: 'Living in different countries gave him a broad cultural perspective.',
          learned: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'v3',
          word: 'Articulate',
          meaning: 'Having or showing the ability to speak fluently and coherently.',
          example: 'She was able to articulate her project ideas clearly to the team.',
          learned: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'v4',
          word: 'Flexible',
          meaning: 'Able to be easily modified to respond to altered circumstances or conditions.',
          example: 'Having a flexible speaking schedule makes daily practice much easier.',
          learned: false,
          created_at: new Date().toISOString(),
        },
      ];
    }
    setVocabulary(list);
  };

  useEffect(() => {
    loadData();
  }, [filterLearned]);

  const handleToggleLearned = async (id: string, current: boolean) => {
    HapticService.notificationSuccess();
    await VocabularyRepository.toggleLearned(id, !current);
    setVocabulary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, learned: !current } : item))
    );
  };

  const handlePronounce = (word: string) => {
    HapticService.selection();
    TTSService.speak(word);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <NeuIconButton
          icon={<ArrowLeft size={18} color={Colors.onSurface} />}
          accessibilityLabel="Go back"
          size={40}
          onPress={() => router.back()}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Vocabulary Bank</Text>
          <Text style={styles.subtitle}>{vocabulary.length} words collected</Text>
        </View>
      </View>

      {/* Filter Tabs (Neumorphic Segmented Control) */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('all')}
          style={[styles.filterTab, filterLearned === 'all' ? styles.filterTabActive : styles.filterTabIdle]}
        >
          <Text style={[styles.filterText, filterLearned === 'all' ? styles.filterTextActive : styles.filterTextIdle]}>
            All ({vocabulary.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('unlearned')}
          style={[styles.filterTab, filterLearned === 'unlearned' ? styles.filterTabActive : styles.filterTabIdle]}
        >
          <Text
            style={[
              styles.filterText,
              filterLearned === 'unlearned' ? styles.filterTextActive : styles.filterTextIdle,
            ]}
          >
            Learning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('learned')}
          style={[styles.filterTab, filterLearned === 'learned' ? styles.filterTabActive : styles.filterTabIdle]}
        >
          <Text
            style={[
              styles.filterText,
              filterLearned === 'learned' ? styles.filterTextActive : styles.filterTextIdle,
            ]}
          >
            Mastered
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vocabulary Items List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {vocabulary.map((item) => (
          <NeuCard key={item.id} variant="raised" style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.wordRow}>
                <Text style={styles.wordText}>{item.word}</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePronounce(item.word)}
                  style={styles.audioTrigger}
                >
                  <Volume2 size={16} color={Colors.primaryAccent} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleLearned(item.id, item.learned)}
                style={styles.checkButton}
              >
                {item.learned ? (
                  <CheckCircle2 size={24} color={Colors.success} />
                ) : (
                  <Circle size={24} color={Colors.mutedLight} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>MEANING</Text>
              <Text style={styles.meaningText}>{item.meaning}</Text>
            </View>

            <View style={styles.exampleBlock}>
              <Text style={styles.exampleLabel}>EXAMPLE</Text>
              <Text style={styles.exampleText}>"{item.example}"</Text>
            </View>
          </NeuCard>
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
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    gap: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  filterRow: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 10,
    gap: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  filterTabIdle: {
    ...NeuShadows.raisedSm,
  },
  filterTabActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  filterText: {
    ...Typography.labelMd,
  },
  filterTextIdle: {
    color: Colors.muted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
  listContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingHorizontal: Spacing.margin,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    padding: Spacing.md,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordText: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  audioTrigger: {
    width: 34,
    height: 34,
    borderRadius: 17,
    ...NeuShadows.raisedSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    padding: 4,
  },
  block: {
    gap: 2,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '700',
  },
  meaningText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  exampleBlock: {
    ...NeuShadows.sunken,
    padding: 12,
    borderRadius: Radius.md,
    gap: 4,
  },
  exampleLabel: {
    ...Typography.labelSm,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  exampleText: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
