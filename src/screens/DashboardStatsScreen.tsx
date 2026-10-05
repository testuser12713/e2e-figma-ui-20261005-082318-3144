import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import { TimeEntry, Transaction } from '../data/types';
import {
  colors,
  fontFamily,
  radius,
  screenInset,
  shadows,
  space,
  type,
} from '../theme';

export type DashboardStatsScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardStats'
>;

/** Periods of the frame's D / W / M / Y segmented switch. */
type Period = 'D' | 'W' | 'M' | 'Y';

const PERIODS: Period[] = ['D', 'W', 'M', 'Y'];

/** The year view's month axis, letter for letter from the frame. */
const YEAR_AXIS = ['M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'M', 'A'];
const MONTH_INITIALS = [
  'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D',
];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Plot geometry, measured from the frame's `Stat` card. */
const PLOT_HEIGHT = 244;
/** Keep the peak's tooltip inside the card. */
const MAX_BAR_HEIGHT = PLOT_HEIGHT - 34;

interface Bucket {
  key: string;
  label: string;
  value: number;
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

function parseDate(value: string): Date | null {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfMonth(date: Date): Date {
  const copy = startOfDay(date);
  copy.setDate(1);
  return copy;
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function addMonths(date: Date, amount: number): Date {
  const copy = startOfMonth(date);
  copy.setMonth(copy.getMonth() + amount);
  return copy;
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** Every distinct day that carries a transaction or a time entry. */
function collectActivityDates(
  transactions: Transaction[],
  timeEntries: TimeEntry[],
): Date[] {
  const dates: Date[] = [];
  const push = (value: string) => {
    const date = parseDate(value);
    if (date) {
      dates.push(startOfDay(date));
    }
  };
  transactions.forEach((entry) => push(entry.date));
  timeEntries.forEach((entry) => push(entry.date));
  return dates;
}

function countDistinctDays(dates: Date[], from: Date, to: Date): number {
  const seen = new Set<string>();
  for (const date of dates) {
    if (date.getTime() >= from.getTime() && date.getTime() <= to.getTime()) {
      seen.add(dayKey(date));
    }
  }
  return seen.size;
}

function distinctDayCount(dates: Date[]): number {
  const seen = new Set<string>();
  for (const date of dates) {
    seen.add(dayKey(date));
  }
  return seen.size;
}

function maxDate(dates: Date[]): Date {
  return dates.reduce((latest, date) =>
    date.getTime() > latest.getTime() ? date : latest,
  );
}

function minDate(dates: Date[]): Date {
  return dates.reduce((earliest, date) =>
    date.getTime() < earliest.getTime() ? date : earliest,
  );
}

/** Bucket the shared data for the selected period, oldest bucket first. */
function buildBuckets(period: Period, dates: Date[]): Bucket[] {
  const anchor = dates.length ? maxDate(dates) : startOfDay(new Date());

  if (period === 'D') {
    const buckets: Bucket[] = [];
    for (let index = 6; index >= 0; index -= 1) {
      const day = addDays(anchor, -index);
      buckets.push({
        key: dayKey(day),
        label: WEEKDAY_INITIALS[day.getDay()],
        value: countDistinctDays(dates, day, day),
      });
    }
    return buckets;
  }

  if (period === 'W') {
    const buckets: Bucket[] = [];
    for (let index = 3; index >= 0; index -= 1) {
      const to = addDays(anchor, -index * 7);
      const from = addDays(to, -6);
      buckets.push({
        key: `w-${dayKey(from)}`,
        label: `W${4 - index}`,
        value: countDistinctDays(dates, from, to),
      });
    }
    return buckets;
  }

  const months = period === 'M' ? 6 : 11;
  const anchorMonth = startOfMonth(anchor);
  const buckets: Bucket[] = [];
  for (let index = months - 1; index >= 0; index -= 1) {
    const from = addMonths(anchorMonth, -index);
    const to = addDays(addMonths(from, 1), -1);
    buckets.push({
      key: monthKey(from),
      label:
        period === 'Y'
          ? YEAR_AXIS[months - 1 - index]
          : MONTH_INITIALS[from.getMonth()],
      value: countDistinctDays(dates, from, to),
    });
  }
  return buckets;
}

interface PeriodLabels {
  since: string;
  big: string;
  range: string;
}

/** The frame's own labels for the year view; computed for the other periods. */
function periodLabels(period: Period, dates: Date[]): PeriodLabels {
  if (period === 'Y' || dates.length === 0) {
    return {
      since: 'Since 21. Dec',
      big: '20',
      range: 'Dec 2024 - Jan 2024',
    };
  }
  const earliest = minDate(dates);
  const latest = maxDate(dates);
  const since = `Since ${earliest.getDate()}. ${
    MONTH_SHORT[earliest.getMonth()]
  }`;
  const big = String(distinctDayCount(dates));
  const range =
    period === 'D' || period === 'W'
      ? `${earliest.getDate()}. ${MONTH_SHORT[earliest.getMonth()]} - ${latest.getDate()}. ${MONTH_SHORT[latest.getMonth()]}`
      : `${MONTH_SHORT[earliest.getMonth()]} ${earliest.getFullYear()} - ${MONTH_SHORT[latest.getMonth()]} ${latest.getFullYear()}`;
  return { since, big, range };
}

/**
 * Dashboard `Statistics` state: the period summary, the D/W/M/Y switch and the
 * `Stat` card whose bars are plain token-styled Views. Bar heights derive from
 * the shared `useAppData()` transactions and time entries; there is no chart
 * library. The back control returns to the Dashboard menu.
 */
export function DashboardStatsScreen({ navigation }: DashboardStatsScreenProps) {
  const { transactions, timeEntries } = useAppData();
  const [period, setPeriod] = useState<Period>('Y');

  const activityDates = useMemo(
    () => collectActivityDates(transactions, timeEntries),
    [transactions, timeEntries],
  );

  const buckets = useMemo(
    () => buildBuckets(period, activityDates),
    [period, activityDates],
  );

  const labels = useMemo(
    () => periodLabels(period, activityDates),
    [period, activityDates],
  );

  const maxValue = Math.max(1, ...buckets.map((bucket) => bucket.value));
  const peakIndex = buckets.reduce(
    (best, bucket, index) =>
      bucket.value > buckets[best].value ? index : best,
    0,
  );

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-dashboard-stats"
    >
      <Image
        source={require('../../design/figma/assets/gruppe-maskieren-6.png')}
        style={styles.wave}
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            testID="dashboard-stats-back"
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => navigation.navigate('DashboardMenu')}
            hitSlop={space.s1}
            style={styles.backButton}
          >
            <Svg width={11} height={18} viewBox="0 0 12 18">
              <Path
                d="M10 1 3 9l7 8"
                stroke={colors.iconInk}
                strokeWidth={2}
                fill="none"
              />
            </Svg>
          </Pressable>
          <Image
            source={require('../../design/figma/assets/noun-user-1335326-181461.png')}
            style={styles.userIcon}
          />
        </View>

        <Text style={styles.screenTitle} testID="stats-title">
          Statistics
        </Text>

        <View style={styles.txtBlock}>
          <Text style={styles.since} testID="stats-since">
            {labels.since}
          </Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue} testID="stats-total-value">
              {labels.big}
            </Text>
            <Text style={styles.totalUnit} testID="stats-total-unit">
              DAYS
            </Text>
          </View>
          <Text style={styles.range} testID="stats-range">
            {labels.range}
          </Text>
        </View>

        <View style={styles.switchRow} testID="stats-period-switch">
          {PERIODS.map((option) => {
            const active = option === period;
            return (
              <Pressable
                key={option}
                testID={`stats-period-${option}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Period ${option}`}
                onPress={() => setPeriod(option)}
                style={[styles.switchItem, active && styles.switchItemActive]}
              >
                <Text
                  style={active ? styles.switchLabelActive : styles.switchLabel}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.statCard} testID="stats-chart-card">
          <Image
            source={require('../../design/figma/assets/gruppe-maskieren-1.png')}
            style={styles.gridImage}
            resizeMode="stretch"
          />
          <View style={styles.chartBody}>
            <View style={styles.plotColumn}>
              <View style={styles.barsRow}>
                {buckets.map((bucket, index) => {
                  const height =
                    bucket.value > 0
                      ? (bucket.value / maxValue) * MAX_BAR_HEIGHT
                      : 0;
                  const isPeak = index === peakIndex && bucket.value > 0;
                  return (
                    <View key={bucket.key} style={styles.barColumn}>
                      {isPeak ? (
                        <View
                          testID="stats-peak-tooltip"
                          style={[
                            styles.tooltip,
                            { bottom: height + space.s0 },
                          ]}
                        >
                          <Text style={styles.tooltipText}>
                            {`${bucket.value} DAYS`}
                          </Text>
                        </View>
                      ) : null}
                      <View
                        testID={`stats-bar-${index}`}
                        style={[styles.bar, { height }]}
                      />
                    </View>
                  );
                })}
              </View>
              <View style={styles.monthsRow}>
                {buckets.map((bucket, index) => (
                  <View key={`label-${bucket.key}`} style={styles.monthCell}>
                    <Text
                      style={styles.axisLabel}
                      testID={`stats-axis-${index}`}
                    >
                      {bucket.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.scaleColumn}>
              {[90, 80, 70, 60].map((value) => (
                <Text
                  key={value}
                  style={styles.axisLabel}
                  testID={`stats-scale-${value}`}
                >
                  {value}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footerLine} testID="stats-top-run">
          Top Run: 20 Days
        </Text>
        <Text style={styles.footerLine} testID="stats-restarts">
          Restarts: 4
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 455,
    height: 120,
  },
  content: { paddingBottom: space.s7 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: screenInset,
    paddingTop: space.s4,
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -space.s2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: { width: 27, height: 27 },
  screenTitle: {
    ...type.text16,
    color: colors.fgBody,
    marginTop: space.s7,
    paddingHorizontal: screenInset,
  },
  txtBlock: {
    marginTop: space.s6,
    paddingHorizontal: screenInset,
  },
  since: { ...type.text14Alt, color: colors.fg },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: space.s0,
  },
  totalValue: {
    fontFamily: fontFamily.body,
    fontSize: 24,
    lineHeight: 29,
    color: colors.fgBody,
  },
  totalUnit: {
    ...type.text14Alt,
    color: colors.fgBody,
    marginLeft: space.s0,
  },
  range: {
    ...type.text14Alt,
    color: colors.fgBody,
    marginTop: space.s0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 34,
    marginHorizontal: screenInset,
    marginTop: space.s4,
    paddingHorizontal: space.s4,
    borderRadius: radius.lg,
    backgroundColor: colors.borderSoft,
  },
  switchItem: {
    paddingHorizontal: space.s3,
    paddingVertical: space.s0,
    borderRadius: radius.lg,
  },
  switchItemActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  switchLabel: { ...type.text12Alt, color: colors.fgBody },
  switchLabelActive: {
    fontFamily: fontFamily.heading,
    fontSize: 12,
    lineHeight: 14,
    color: colors.fgBody,
  },
  statCard: {
    marginHorizontal: screenInset,
    marginTop: space.s3,
    paddingTop: space.s4,
    paddingBottom: space.s4,
    paddingLeft: space.s2,
    paddingRight: space.s7,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  gridImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.lg,
  },
  chartBody: { flexDirection: 'row' },
  plotColumn: { flex: 1 },
  barsRow: {
    height: PLOT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 8,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  tooltip: {
    position: 'absolute',
    left: '50%',
    width: 72,
    height: 26,
    marginLeft: -36,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  tooltipText: { ...type.text12Alt, color: colors.fgBody },
  monthsRow: { flexDirection: 'row', marginTop: space.s0 },
  monthCell: { flex: 1, alignItems: 'center' },
  axisLabel: {
    fontFamily: fontFamily.heading,
    fontSize: 12,
    lineHeight: 14,
    color: colors.fgBody,
    opacity: 0.2,
  },
  scaleColumn: {
    width: 34,
    height: PLOT_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLine: {
    ...type.text14Alt,
    color: colors.fgBody,
    marginTop: space.s6,
    paddingHorizontal: screenInset,
  },
});

export default DashboardStatsScreen;
