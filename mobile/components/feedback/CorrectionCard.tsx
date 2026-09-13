import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Correction } from '../../types';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle } from 'lucide-react-native';

interface CorrectionCardProps {
  correction: Correction;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction }) => {
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
        <View style={styles.originalHeader}>
          <AlertTriangle size={13} color={Colors.error} />
          <Text style={styles.originalLabel}>Original</Text>
        </View>
        <Text style={styles.originalText}>{correction.original}</Text>
      </View>

      {/* Corrected sentence (Raised accent highlight) */}
      <View style={styles.correctedContainer}>
        <View style={styles.correctedHeader}>
          <CheckCircle2 size={14} color={Colors.success} />
          <Text style={styles.correctedLabel}>Better phrasing</Text>
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
    gap: 4,
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
  correctedContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    padding: 10,
    borderRadius: Radius.md,
    gap: 4,
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
