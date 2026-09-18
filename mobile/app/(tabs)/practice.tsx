import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PRACTICE_TOPICS } from '../../constants/topics';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { useUserStore } from '../../store/useUserStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { Badge } from '../../components/ui/Badge';
import { NeuCard } from '../../components/ui/NeuCard';
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
  const user = useUserStore((state) => state.user);
  const startSession = usePracticeStore((state) => state.startSession);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTopics =
    selectedCategory === 'All'
      ? PRACTICE_TOPICS
      : PRACTICE_TOPICS.filter((t) => t.category === selectedCategory);

  const getTopicIcon = (icon: string) => {
    const size = 20;
    const color = Colors.primaryAccent;
    switch (icon) {
      case 'wb_sunny':
        return <Sun size={size} color={color} />;
      case 'restaurant':
        return <Coffee size={size} color={color} />;
      case 'flight_takeoff':
        return <Plane size={size} color={color} />;
      case 'coffee':
        return <Coffee size={size} color={color} />;
      case 'sports_esports':
        return <Gamepad2 size={size} color={color} />;
      case 'work_outline':
        return <Briefcase size={size} color={color} />;
      case 'groups':
        return <Users size={size} color={color} />;
      case 'forum':
        return <MessageSquare size={size} color={color} />;
      case 'smart_toy':
        return <Bot size={size} color={color} />;
      case 'eco':
        return <Leaf size={size} color={color} />;
      default:
        return <Sparkles size={size} color={color} />;
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

      {/* Category Filter Chips (Tactile Neumorphic Pills) */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipIdle,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive ? styles.chipTextActive : styles.chipTextIdle,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Topics List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredTopics.map((topic) => (
          <NeuCard
            key={topic.id}
            variant="raised"
            style={styles.card}
            onPress={() => handleSelectTopic(topic.title, topic.starter_prompt)}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                {getTopicIcon(topic.icon)}
              </View>
              <Badge label={topic.category} variant="accent" />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Text style={styles.cardSubtitle}>{topic.subtitle}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.starterPreviewBox}>
                <Text style={styles.starterPreview} numberOfLines={1}>
                  "{topic.starter_prompt}"
                </Text>
              </View>
              <View style={styles.arrowCircle}>
                <ArrowRight size={14} color={Colors.primaryAccent} />
              </View>
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
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
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
  filterContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    height: 54,
    marginVertical: 4,
    justifyContent: 'center',
  },
  filterBar: {
    paddingHorizontal: Spacing.margin,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    ...NeuShadows.raisedSm,
  },
  chipActive: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSunken,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextIdle: {
    color: Colors.onSurfaceVariant,
  },
  chipTextActive: {
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
    padding: 16,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    ...NeuShadows.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  cardSubtitle: {
    ...Typography.bodySm,
    color: Colors.muted,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  starterPreviewBox: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  starterPreview: {
    ...Typography.bodySm,
    fontSize: 12,
    color: Colors.muted,
    fontStyle: 'italic',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    ...NeuShadows.raisedSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
