import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PRACTICE_TOPICS } from '../../constants/topics';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { Badge } from '../../components/ui/Badge';
import {
  Sun,
  Briefcase,
  Plane,
  Coffee,
  Gamepad2,
  Users,
  MessageSquare,
  Bot,
  Leaf,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';

const CATEGORIES = ['All', 'Everyday', 'Professional', 'Advanced', 'Free Conversation'] as const;

export default function PracticeScreen() {
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const startSession = usePracticeStore(state => state.startSession);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTopics = selectedCategory === 'All'
    ? PRACTICE_TOPICS
    : PRACTICE_TOPICS.filter(t => t.category === selectedCategory);

  const getTopicIcon = (icon: string) => {
    switch (icon) {
      case 'wb_sunny': return <Sun size={20} color={Colors.primary} />;
      case 'restaurant': return <Coffee size={20} color={Colors.primary} />;
      case 'flight_takeoff': return <Plane size={20} color={Colors.primary} />;
      case 'coffee': return <Coffee size={20} color={Colors.primary} />;
      case 'sports_esports': return <Gamepad2 size={20} color={Colors.primary} />;
      case 'work_outline': return <Briefcase size={20} color={Colors.primary} />;
      case 'groups': return <Users size={20} color={Colors.primary} />;
      case 'forum': return <MessageSquare size={20} color={Colors.primary} />;
      case 'smart_toy': return <Bot size={20} color={Colors.primary} />;
      case 'eco': return <Leaf size={20} color={Colors.primary} />;
      default: return <Sparkles size={20} color={Colors.primary} />;
    }
  };

  const handleSelectTopic = async (title: string, starter: string) => {
    const level = user?.level || 'B1';
    await startSession(title, level, starter);
    router.push('/practice/session');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice Topics</Text>
        <Text style={styles.subtitle}>Select a subject or start an open conversation</Text>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.chip,
                selectedCategory === cat && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Topics List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredTopics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.88}
            style={styles.card}
            onPress={() => handleSelectTopic(topic.title, topic.starter_prompt)}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                {getTopicIcon(topic.icon)}
              </View>
              <Badge label={topic.category} variant="default" />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Text style={styles.cardSubtitle}>{topic.subtitle}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.starterPreview}>"{topic.starter_prompt.slice(0, 50)}..."</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight size={14} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
    marginTop: 2,
  },
  filterContainer: {
    height: 48,
    marginVertical: 4,
    justifyContent: 'center',
  },
  filterBar: {
    paddingHorizontal: Spacing.margin,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: Colors.muted,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  chipTextActive: {
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
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    gap: 3,
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  cardSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  cardFooter: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starterPreview: {
    ...Typography.bodySm,
    fontSize: 12,
    color: Colors.muted,
    fontStyle: 'italic',
    flex: 1,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
