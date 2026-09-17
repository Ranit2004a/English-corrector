import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message, Correction } from '../../types';
import { Colors, NeuShadows, Radius, Typography, Spacing } from '../../constants/theme';
import { TTSService } from '../../services/tts';
import { AudioRecorderService } from '../../services/audioRecorder';
import { CorrectionCard } from '../feedback/CorrectionCard';
import { Volume2, VolumeX, Play, Square, ChevronDown, ChevronUp, Sparkles, Mic } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
  corrections?: Correction[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, corrections = [] }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlayingUserVoice, setIsPlayingUserVoice] = useState(false);
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

  const handleToggleUserVoice = async () => {
    if (!message.audio_uri) return;

    if (isPlayingUserVoice) {
      await AudioRecorderService.stopAudio();
      setIsPlayingUserVoice(false);
    } else {
      setIsPlayingUserVoice(true);
      await AudioRecorderService.playAudio(message.audio_uri, {
        onStart: () => setIsPlayingUserVoice(true),
        onFinish: () => setIsPlayingUserVoice(false),
        onError: () => setIsPlayingUserVoice(false),
      });
    }
  };

  return (
    <View style={[styles.container, isAI ? styles.containerAI : styles.containerUser]}>
      {/* Header Info */}
      <View style={[styles.header, isAI ? styles.headerAI : styles.headerUser]}>
        <Text style={styles.senderName}>{isAI ? 'TalkTune AI' : 'You'}</Text>
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
              <Volume2 size={14} color={Colors.primaryAccent} />
              <Text style={styles.listenText}>Listen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Recorded Audio Playback Trigger */}
        {!isAI && message.audio_uri && (
          <View style={styles.userActionRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleUserVoice}
              style={[styles.userVoiceButton, isPlayingUserVoice && styles.userVoiceButtonActive]}
            >
              {isPlayingUserVoice ? (
                <Square size={12} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
              )}
              <Text style={styles.userVoiceText}>
                {isPlayingUserVoice ? 'Playing...' : 'Play My Voice'}
              </Text>
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
            <Sparkles size={13} color={Colors.primaryAccent} />
            <Text style={styles.feedbackTriggerText}>
              {corrections.length} correction{corrections.length > 1 ? 's' : ''} available
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
    marginVertical: 8,
    maxWidth: '88%',
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
    marginBottom: 5,
    gap: 5,
  },
  headerAI: {
    paddingLeft: 6,
  },
  headerUser: {
    paddingRight: 6,
    justifyContent: 'flex-end',
  },
  senderName: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '700',
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
    paddingVertical: 14,
    borderRadius: Radius.lg,
  },
  bubbleAI: {
    ...NeuShadows.raised,
    borderTopLeftRadius: Radius.xs,
  },
  bubbleUser: {
    ...NeuShadows.accentRaised,
    borderTopRightRadius: Radius.xs,
  },
  messageText: {
    ...Typography.bodyMd,
    lineHeight: 22,
  },
  messageTextAI: {
    color: Colors.onSurface,
  },
  messageTextUser: {
    color: Colors.onPrimaryAccent,
    fontWeight: '500',
  },
  aiActionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineDark,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  listenText: {
    ...Typography.labelMd,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: 8,
    width: '100%',
    alignItems: 'flex-end',
  },
  feedbackTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...NeuShadows.raisedSm,
  },
  feedbackTriggerText: {
    ...Typography.labelMd,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  feedbackDrawer: {
    width: '100%',
    marginTop: 8,
  },
  userActionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userVoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  userVoiceButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  userVoiceText: {
    ...Typography.labelMd,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
