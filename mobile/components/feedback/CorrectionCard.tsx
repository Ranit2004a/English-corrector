import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Correction } from '../../types';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { Badge } from '../ui/Badge';
import { TTSService } from '../../services/tts';
import { AudioRecorderService } from '../../services/audioRecorder';
import { CheckCircle2, AlertTriangle, Play, Square, Volume2 } from 'lucide-react-native';

interface CorrectionCardProps {
  correction: Correction;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction }) => {
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingCorrected, setIsPlayingCorrected] = useState(false);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'important':
        return 'error';
      case 'minor':
        return 'accent';
      default:
        return 'default';
    }
  };

  const handlePlayOriginalVoice = async () => {
    if (!correction.audio_uri) return;

    if (isPlayingOriginal) {
      await AudioRecorderService.stopAudio();
      setIsPlayingOriginal(false);
    } else {
      TTSService.stop();
      setIsPlayingCorrected(false);
      setIsPlayingOriginal(true);
      await AudioRecorderService.playAudio(correction.audio_uri, {
        onStart: () => setIsPlayingOriginal(true),
        onFinish: () => setIsPlayingOriginal(false),
        onError: () => setIsPlayingOriginal(false),
      });
    }
  };

  const handlePlayCorrectedPhrasing = () => {
    if (isPlayingCorrected) {
      TTSService.stop();
      setIsPlayingCorrected(false);
    } else {
      AudioRecorderService.stopAudio();
      setIsPlayingOriginal(false);
      setIsPlayingCorrected(true);
      TTSService.speak(correction.corrected, {
        onDone: () => setIsPlayingCorrected(false),
        onError: () => setIsPlayingCorrected(false),
      });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryTitle}>{correction.category.toUpperCase()}</Text>
        </View>
        <Badge label={correction.severity} variant={getSeverityVariant(correction.severity)} />
      </View>

      {/* Original sentence (Sunken debossed strip) */}
      <View style={styles.originalContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.originalHeader}>
            <AlertTriangle size={13} color={Colors.error} />
            <Text style={styles.originalLabel}>You said</Text>
          </View>
          {correction.audio_uri && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePlayOriginalVoice}
              style={[styles.playAudioChip, isPlayingOriginal && styles.playAudioChipActive]}
            >
              {isPlayingOriginal ? (
                <Square size={11} color={Colors.error} fill={Colors.error} />
              ) : (
                <Play size={11} color={Colors.error} fill={Colors.error} />
              )}
              <Text style={styles.playAudioText}>
                {isPlayingOriginal ? 'Playing...' : 'Hear Your Voice'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.originalText}>{correction.original}</Text>
      </View>

      {/* Corrected sentence (Raised accent highlight) */}
      <View style={styles.correctedContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.correctedHeader}>
            <CheckCircle2 size={14} color={Colors.success} />
            <Text style={styles.correctedLabel}>Better phrasing</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePlayCorrectedPhrasing}
            style={[styles.playCorrectChip, isPlayingCorrected && styles.playCorrectChipActive]}
          >
            <Volume2 size={12} color={Colors.success} />
            <Text style={styles.playCorrectText}>
              {isPlayingCorrected ? 'Speaking...' : 'Listen to Phrasing'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.correctedText}>{correction.corrected}</Text>
      </View>

      {/* Explanation */}
      {correction.explanation && (
        <View style={styles.explanationBlock}>
          <Text style={styles.explanationLabel}>Why this works better:</Text>
          <Text style={styles.explanationText}>{correction.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...NeuShadows.raised,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    gap: 12,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  categoryTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '700',
  },
  originalContainer: {
    ...NeuShadows.sunken,
    padding: 10,
    borderRadius: Radius.md,
    gap: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  originalLabel: {
    ...Typography.labelSm,
    color: Colors.error,
    fontWeight: '600',
  },
  originalText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  playAudioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  playAudioChipActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  playAudioText: {
    ...Typography.labelSm,
    color: Colors.error,
    fontWeight: '700',
  },
  correctedContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    padding: 10,
    borderRadius: Radius.md,
    gap: 6,
  },
  correctedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  correctedLabel: {
    ...Typography.labelSm,
    color: Colors.success,
    fontWeight: '700',
  },
  correctedText: {
    ...Typography.bodyMd,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  playCorrectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  playCorrectChipActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
  },
  playCorrectText: {
    ...Typography.labelSm,
    color: Colors.success,
    fontWeight: '700',
  },
  explanationBlock: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 2,
  },
  explanationLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '600',
  },
  explanationText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
  },
});
