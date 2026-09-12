import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { VocabularyRepository } from '../../db/repositories/vocabularyRepository';
import { VocabularyItem } from '../../types';
import { TTSService } from '../../services/tts';
import { ArrowLeft, Volume2, CheckCircle2, Circle, BookOpen } from 'lucide-react-native';

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

    // Default curated words if fresh install
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
    await VocabularyRepository.toggleLearned(id, !current);
    setVocabulary(prev =>
      prev.map(item => (item.id === id ? { ...item, learned: !current } : item))
    );
  };

  const handlePronounce = (word: string) => {
    TTSService.speak(word);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Vocabulary Bank</Text>
          <Text style={styles.subtitle}>{vocabulary.length} words collected</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('all')}
          style={[styles.filterTab, filterLearned === 'all' && styles.filterTabActive]}
        >
          <Text style={[styles.filterText, filterLearned === 'all' && styles.filterTextActive]}>
            All ({vocabulary.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('unlearned')}
          style={[styles.filterTab, filterLearned === 'unlearned' && styles.filterTabActive]}
        >
          <Text style={[styles.filterText, filterLearned === 'unlearned' && styles.filterTextActive]}>
            Learning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterLearned('learned')}
          style={[styles.filterTab, filterLearned === 'learned' && styles.filterTabActive]}
        >
          <Text style={[styles.filterText, filterLearned === 'learned' && styles.filterTextActive]}>
            Mastered
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vocabulary Items List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {vocabulary.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.wordRow}>
                <Text style={styles.wordText}>{item.word}</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePronounce(item.word)}
                  style={styles.audioTrigger}
                >
                  <Volume2 size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleLearned(item.id, item.learned)}
                style={styles.checkButton}
              >
                {item.learned ? (
                  <CheckCircle2 size={22} color={Colors.primary} />
                ) : (
                  <Circle size={22} color={Colors.outlineVariant} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.block}>
              <Text style={styles.label}>Meaning</Text>
              <Text style={styles.meaningText}>{item.meaning}</Text>
            </View>

            <View style={styles.exampleBlock}>
              <Text style={styles.exampleLabel}>Example</Text>
              <Text style={styles.exampleText}>"{item.example}"</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  filterTextActive: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Spacing.margin,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordText: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  audioTrigger: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
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
  },
  meaningText: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  exampleBlock: {
    backgroundColor: Colors.surfaceSubtle,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    gap: 2,
  },
  exampleLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '600',
  },
  exampleText: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontStyle: 'italic',
  },
});
