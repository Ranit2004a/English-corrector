import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';

export interface SkillScores {
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  naturalness: number;
}

interface SkillRadarChartProps {
  scores: SkillScores;
  size?: number;
}

const AXIS_LABELS = [
  { key: 'grammar', label: 'Grammar', icon: '📘' },
  { key: 'vocabulary', label: 'Vocabulary', icon: '💡' },
  { key: 'fluency', label: 'Fluency', icon: '⚡' },
  { key: 'pronunciation', label: 'Pronunciation', icon: '🎙️' },
  { key: 'naturalness', label: 'Naturalness', icon: '✨' },
];

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  scores,
  size = 280,
}) => {
  const center = size / 2;
  const radius = (size / 2) - 42; // Leave room for outside labels
  const totalAxes = AXIS_LABELS.length;

  // Calculate coordinates for an angle and radius
  const getCoordinates = (angleIndex: number, valueRatio: number, clamp: boolean = true) => {
    const angle = (angleIndex * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const ratio = clamp ? Math.max(0.1, Math.min(1.0, valueRatio)) : valueRatio;
    const r = radius * ratio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Concentric polygon grid levels: 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (level: number) => {
    return Array.from({ length: totalAxes })
      .map((_, i) => {
        const pt = getCoordinates(i, level);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  };

  // User score polygon points
  const scoreKeys = ['grammar', 'vocabulary', 'fluency', 'pronunciation', 'naturalness'] as const;
  const userPolygonPoints = scoreKeys
    .map((key, i) => {
      const score = scores[key] ?? 70;
      const ratio = score / 100;
      const pt = getCoordinates(i, ratio);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Get vertex points for circles
  const vertexPoints = scoreKeys.map((key, i) => {
    const score = scores[key] ?? 70;
    const ratio = score / 100;
    return {
      ...getCoordinates(i, ratio),
      score,
      key,
    };
  });

  const getCEFRLevelBadge = (avg: number) => {
    if (avg >= 88) return { label: 'C2 Mastery', color: Colors.success };
    if (avg >= 78) return { label: 'C1 Advanced', color: Colors.primaryAccent };
    if (avg >= 68) return { label: 'B2 Upper-Int', color: Colors.warning };
    return { label: 'B1 Intermediate', color: Colors.muted };
  };

  const overallAvg = Math.round(
    (scores.grammar + scores.vocabulary + scores.fluency + scores.pronunciation + scores.naturalness) / 5
  );
  const cefrBadge = getCEFRLevelBadge(overallAvg);

  return (
    <View style={styles.container}>
      {/* Header Summary */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>CEFR SKILLS RADAR</Text>
          <Text style={styles.subtitle}>5-Dimensional Language Profile</Text>
        </View>
        <View style={[styles.cefrPill, { borderColor: cefrBadge.color }]}>
          <Text style={[styles.cefrText, { color: cefrBadge.color }]}>{cefrBadge.label}</Text>
        </View>
      </View>

      {/* SVG Radar Visualization */}
      <View style={styles.svgWrapper}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#111111" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#334155" stopOpacity="0.08" />
            </LinearGradient>
          </Defs>

          {/* Background Concentric Polygon Grids */}
          {gridLevels.map((lvl, idx) => (
            <Polygon
              key={`grid-${idx}`}
              points={getPolygonPoints(lvl)}
              fill={idx === gridLevels.length - 1 ? 'rgba(255, 255, 255, 0.4)' : 'none'}
              stroke="#CBD5E1"
              strokeWidth={idx === gridLevels.length - 1 ? 1.5 : 1}
              strokeDasharray={idx < gridLevels.length - 1 ? '3,3' : undefined}
            />
          ))}

          {/* Axis Spokes from Center to Outer Radius */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const pt = getCoordinates(i, 1.0);
            return (
              <Line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={pt.x}
                y2={pt.y}
                stroke="#B2BECF"
                strokeWidth={1}
              />
            );
          })}

          {/* User Score Data Polygon */}
          <Polygon
            points={userPolygonPoints}
            fill="url(#radarFill)"
            stroke="#111111"
            strokeWidth={2.5}
          />

          {/* Glowing Vertex Dots & Values */}
          {vertexPoints.map((pt, idx) => (
            <G key={`node-${idx}`}>
              <Circle
                cx={pt.x}
                cy={pt.y}
                r={5.5}
                fill="#111111"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </G>
          ))}

          {/* Axis Labels positioned around perimeter */}
          {AXIS_LABELS.map((item, i) => {
            const pt = getCoordinates(i, 1.25, false);
            return (
              <SvgText
                key={`label-${i}`}
                x={pt.x}
                y={pt.y + 4}
                fill="#334155"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                {`${item.icon} ${item.label}`}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Metric Breakdown Chips Grid */}
      <View style={styles.metricsGrid}>
        {scoreKeys.map((key) => {
          const item = AXIS_LABELS.find((a) => a.key === key)!;
          const val = scores[key] ?? 70;
          return (
            <View key={key} style={styles.metricChip}>
              <Text style={styles.metricChipLabel}>
                {item.icon} {item.label}
              </Text>
              <Text style={styles.metricChipValue}>{val}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...NeuShadows.raised,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontWeight: '600',
    marginTop: 2,
  },
  cefrPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    backgroundColor: Colors.surfaceSubtle,
  },
  cefrText: {
    ...Typography.labelSm,
    fontWeight: '800',
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(163, 177, 198, 0.25)',
  },
  metricChip: {
    ...NeuShadows.sunken,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: '48%',
  },
  metricChipLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 11,
  },
  metricChipValue: {
    ...Typography.labelSm,
    color: Colors.primaryAccent,
    fontWeight: '800',
  },
});
