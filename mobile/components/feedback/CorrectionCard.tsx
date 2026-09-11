import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Correction } from '../../types';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Badge } from '../ui/Badge';

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
        <Text style={styles.categoryTitle}>{correction.category.toUpperCase()} NOTE</Text>
        <Badge label={correction.severity} variant={getSeverityVariant(correction.severity)} />
      </View>

      {/* Original sentence */}
      <View style={styles.block}>
        <Text style={styles.label}>Your sentence</Text>
        <Text style={styles.originalText}>{correction.original}</Text>
      </View>

      {/* Corrected sentence */}
      <View style={styles.block}>
        <Text style={styles.label}>Better</Text>
        <Text style={styles.correctedText}>{correction.corrected}</Text>
      </View>

      {/* Explanation */}
      <View style={styles.explanationBlock}>
        <Text style={styles.explanationLabel}>Why?</Text>
        <Text style={styles.explanationText}>{correction.explanation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: Spacing.md,
    gap: 10,
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryTitle: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  block: {
    gap: 2,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.muted,
  },
  originalText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  correctedText: {
    ...Typography.bodyMd,
    fontWeight: '600',
    color: Colors.primary,
  },
  explanationBlock: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    gap: 2,
  },
  explanationLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '600',
  },
  explanationText: {
    ...Typography.bodySm,
    color: Colors.onSurface,
  },
});
