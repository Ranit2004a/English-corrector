import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DailyProgress } from '../../types';
import { Colors, NeuShadows, Radius, Spacing, Typography } from '../../constants/theme';
import { Flame, Clock, CheckCircle2, Calendar } from 'lucide-react-native';

interface ActivityHeatmapProps {
  progressData: DailyProgress[];
  daysCount?: number; // Default 28 days (4 weeks)
  dailyGoalMinutes?: number;
}

interface DayItem {
  dateStr: string;
  dayOfMonth: number;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ...
  minutes: number;
  mistakes: number;
  sessions: number;
  isToday: boolean;
  isFuture: boolean;
}

const WEEKDAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const getLocalDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string): Date => {
  const parts = dateStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  progressData = [],
  daysCount = 28,
  dailyGoalMinutes = 15,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayItem | null>(null);

  // Generate matrix of days for the past 4 weeks (28 days aligned to Mon-Sun weeks)
  const heatmapDays = React.useMemo(() => {
    const list: DayItem[] = [];
    const now = new Date();
    const progressMap = new Map<string, DailyProgress>();
    progressData.forEach((p) => progressMap.set(p.date, p));

    // Align to 28 days (4 weeks)
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = getLocalDateKey(d);
      const rec = progressMap.get(dateStr);

      list.push({
        dateStr,
        dayOfMonth: d.getDate(),
        dayOfWeek: d.getDay(),
        minutes: rec ? rec.speaking_minutes : 0,
        mistakes: rec ? rec.mistakes_count : 0,
        sessions: rec ? rec.sessions_completed : 0,
        isToday: i === 0,
        isFuture: false,
      });
    }

    return list;
  }, [progressData, daysCount]);

  // Group into weeks (each week = 7 days)
  const weeks = React.useMemo(() => {
    const chunks: DayItem[][] = [];
    for (let i = 0; i < heatmapDays.length; i += 7) {
      chunks.push(heatmapDays.slice(i, i + 7));
    }
    return chunks;
  }, [heatmapDays]);

  const activeDaysCount = heatmapDays.filter((d) => d.minutes > 0).length;
  const totalMinutes = heatmapDays.reduce((sum, d) => sum + d.minutes, 0);

  const getTileStyle = (day: DayItem) => {
    if (day.minutes === 0) {
      return styles.tileZero;
    }
    if (day.minutes >= dailyGoalMinutes) {
      return styles.tileGoal;
    }
    if (day.minutes >= 8) {
      return styles.tileHigh;
    }
    return styles.tileLow;
  };

  const formatFullDate = (dateStr: string) => {
    try {
      const d = parseLocalDate(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>SPEAKING ACTIVITY HEATMAP</Text>
          <Text style={styles.subtitle}>
            {activeDaysCount} active days in last {daysCount} days
          </Text>
        </View>
        <View style={styles.totalPill}>
          <Clock size={12} color={Colors.primaryAccent} />
          <Text style={styles.totalText}>{totalMinutes}m spoken</Text>
        </View>
      </View>

      {/* Weekday Labels Header */}
      <View style={styles.weekdayRow}>
        {WEEKDAY_NAMES.map((w, idx) => (
          <Text key={`wkday-${idx}`} style={styles.weekdayLabel}>
            {w}
          </Text>
        ))}
      </View>

      {/* Heatmap Grid */}
      <View style={styles.grid}>
        {weeks.map((week, wIdx) => (
          <View key={`week-${wIdx}`} style={styles.weekRow}>
            {week.map((day) => {
              const isSelected = selectedDay?.dateStr === day.dateStr;
              return (
                <TouchableOpacity
                  key={day.dateStr}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.tile,
                    getTileStyle(day),
                    day.isToday && styles.tileToday,
                    isSelected && styles.tileSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tileDateText,
                      day.minutes >= dailyGoalMinutes && styles.tileDateTextGoal,
                    ]}
                  >
                    {day.dayOfMonth}
                  </Text>
                  {day.isToday && <View style={styles.todayIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Heatmap Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>Less</Text>
        <View style={[styles.legendBox, styles.tileZero]} />
        <View style={[styles.legendBox, styles.tileLow]} />
        <View style={[styles.legendBox, styles.tileHigh]} />
        <View style={[styles.legendBox, styles.tileGoal]} />
        <Text style={styles.legendLabel}>Goal ({dailyGoalMinutes}m+)</Text>
      </View>

      {/* Selected Day Inspection Drawer */}
      {selectedDay && (
        <View style={styles.inspectorContainer}>
          <View style={styles.inspectorHeader}>
            <View style={styles.inspectorTitleRow}>
              <Calendar size={13} color={Colors.primaryAccent} />
              <Text style={styles.inspectorDate}>{formatFullDate(selectedDay.dateStr)}</Text>
              {selectedDay.isToday && <Text style={styles.todayBadge}>TODAY</Text>}
            </View>
            <TouchableOpacity onPress={() => setSelectedDay(null)}>
              <Text style={styles.inspectorClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inspectorStatsRow}>
            <View style={styles.inspectorStat}>
              <Text style={styles.inspectorStatVal}>{selectedDay.minutes} mins</Text>
              <Text style={styles.inspectorStatLbl}>Speaking Time</Text>
            </View>
            <View style={styles.inspectorStatDivider} />
            <View style={styles.inspectorStat}>
              <Text style={styles.inspectorStatVal}>{selectedDay.sessions}</Text>
              <Text style={styles.inspectorStatLbl}>Sessions</Text>
            </View>
            <View style={styles.inspectorStatDivider} />
            <View style={styles.inspectorStat}>
              <Text style={styles.inspectorStatVal}>{selectedDay.mistakes}</Text>
              <Text style={styles.inspectorStatLbl}>Mistake Fixes</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...NeuShadows.raised,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalPill: {
    ...NeuShadows.raisedSm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  totalText: {
    ...Typography.labelSm,
    color: Colors.primaryAccent,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  weekdayLabel: {
    ...Typography.labelSm,
    color: Colors.muted,
    fontWeight: '700',
    width: 38,
    textAlign: 'center',
  },
  grid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  tileZero: {
    ...NeuShadows.sunken,
  },
  tileLow: {
    backgroundColor: '#94A3B8',
  },
  tileHigh: {
    backgroundColor: '#475569',
  },
  tileGoal: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tileToday: {
    borderWidth: 2,
    borderColor: Colors.primaryAccent,
  },
  tileSelected: {
    transform: [{ scale: 1.08 }],
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  tileDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  tileDateTextGoal: {
    color: '#FFFFFF',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 4,
  },
  legendLabel: {
    ...Typography.labelSm,
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  inspectorContainer: {
    ...NeuShadows.sunken,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    padding: 12,
    marginTop: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inspectorDate: {
    ...Typography.bodySm,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  todayBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  inspectorClose: {
    color: Colors.muted,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  inspectorStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  inspectorStat: {
    flex: 1,
    alignItems: 'center',
  },
  inspectorStatVal: {
    ...Typography.bodySm,
    fontWeight: '800',
    color: Colors.primaryAccent,
  },
  inspectorStatLbl: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '600',
    marginTop: 1,
  },
  inspectorStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(163, 177, 198, 0.3)',
  },
});
