import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message, Correction } from '../../types';
import { Colors, Radius, Typography, Spacing } from '../../constants/theme';
import { TTSService } from '../../services/tts';
import { CorrectionCard } from '../feedback/CorrectionCard';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
  corrections?: Correction[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, corrections = [] }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const isAI = message.role === 'assistant';

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleSpeak = () => {
    TTSService.speak(message.text);
  };

  return (
    <View style={[styles.container, isAI ? styles.containerAI : styles.containerUser]}>
      {/* Header Info */}
      <View style={[styles.header, isAI ? styles.headerAI : styles.headerUser]}>
        <Text style={styles.senderName}>{isAI ? 'Echo' : 'You'}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.timestamp}>{formatTime(message.created_at)}</Text>
      </View>

      {/* Bubble Box */}
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={[styles.messageText, isAI ? styles.messageTextAI : styles.messageTextUser]}>
          {message.text}
        </Text>

        {/* AI Audio Replay Trigger */}
        {isAI && (
          <View style={styles.aiActionRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSpeak} style={styles.listenButton}>
              <Volume2 size={15} color={Colors.muted} />
              <Text style={styles.listenText}>Listen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* User Suggestion Tag & Drawer */}
      {!isAI && corrections.length > 0 && (
        <View style={styles.feedbackContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowFeedback(!showFeedback)}
            style={styles.feedbackTrigger}
          >
            <View style={styles.feedbackDot} />
            <Text style={styles.feedbackTriggerText}>
              {corrections.length} suggestion{corrections.length > 1 ? 's' : ''} available
            </Text>
            {showFeedback ? (
              <ChevronUp size={14} color={Colors.muted} />
            ) : (
              <ChevronDown size={14} color={Colors.muted} />
            )}
          </TouchableOpacity>

          {showFeedback && (
            <View style={styles.feedbackDrawer}>
              {corrections.map((corr) => (
                <CorrectionCard key={corr.id} correction={corr} />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    maxWidth: '86%',
  },
  containerAI: {
    alignSelf: 'flex-start',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  headerAI: {
    paddingLeft: 4,
  },
  headerUser: {
    paddingRight: 4,
    justifyContent: 'flex-end',
  },
  senderName: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  dot: {
    ...Typography.labelSm,
    color: Colors.mutedLight,
  },
  timestamp: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
  },
  bubbleAI: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderTopLeftRadius: Radius.sm,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: Radius.sm,
  },
  messageText: {
    ...Typography.bodyMd,
    lineHeight: 22,
  },
  messageTextAI: {
    color: Colors.onSurface,
  },
  messageTextUser: {
    color: Colors.onPrimary,
  },
  aiActionRow: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  listenText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  feedbackContainer: {
    marginTop: 6,
    width: '100%',
    alignItems: 'flex-end',
  },
  feedbackTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  feedbackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.muted,
  },
  feedbackTriggerText: {
    ...Typography.labelMd,
    color: Colors.muted,
  },
  feedbackDrawer: {
    width: '100%',
    marginTop: 6,
  },
});
