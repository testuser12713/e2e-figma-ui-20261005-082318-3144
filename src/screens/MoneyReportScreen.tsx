import React, { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { G, Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Row from '../components/Row';
import { useAppData } from '../state/AppData';
import { Transaction } from '../data/types';
import { MoneyStackParamList } from '../navigation/types';
import {
  TAB_BAR_HEIGHT,
  colors,
  radius,
  screenInset,
  space,
  type,
} from '../theme';

export type MoneyReportScreenProps = NativeStackScreenProps<
  MoneyStackParamList,
  'MoneyReport'
>;

/**
 * The weekly report state of the Money Management screen (frame
 * "Money Management 2"): a white header block with the "WEEKLY REPORT" eyebrow,
 * a 7-day bar chart whose green (expenses) and dark (deposit) segments are
 * computed from the shared transactions, a legend, and the day-grouped
 * transaction list below it.
 */

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const CHART_DAYS = 7;
const CHART_HEIGHT = 200;
const BAR_WIDTH = 8;
const DAY_MS = 24 * 60 * 60 * 1000;

const THUMBNAILS: Record<'movie' | 'coffee' | 'shop' | 'other', ImageSourcePropType> =
  {
    movie: require('../../design/figma/assets/illustration-53x53.png'),
    coffee: require('../../design/figma/assets/illustration-53x53-2.png'),
    shop: require('../../design/figma/assets/illustration-53x53-3.png'),
    other: require('../../design/figma/assets/illustration-53x53-4.png'),
  };

/** Picks the category thumbnail named by the frame; unknown categories fall back. */
function thumbnailFor(category: string): ImageSourcePropType {
  const key = category.trim().toLowerCase();
  if (key === 'movie' || key === 'coffee' || key === 'shop') {
    return THUMBNAILS[key];
  }
  return THUMBNAILS.other;
}

/** Formats an ISO date as the frame's day label, e.g. `02- Monday`. */
function dayLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map((part) => Number(part));
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  const weekday = WEEKDAYS[date.getUTCDay()] ?? '';
  return `${String(day || 0).padStart(2, '0')}- ${weekday}`;
}

interface DayGroup {
  date: string;
  label: string;
  transactions: Transaction[];
}

/** Groups transactions by day, newest day first, keeping the source order. */
function groupByDay(transactions: Transaction[]): DayGroup[] {
  const byDay = new Map<string, Transaction[]>();
  for (const transaction of transactions) {
    const bucket = byDay.get(transaction.date);
    if (bucket) {
      bucket.push(transaction);
    } else {
      byDay.set(transaction.date, [transaction]);
    }
  }
  return Array.from(byDay.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
    .map(([date, items]) => ({ date, label: dayLabel(date), transactions: items }));
}

interface ChartBar {
  date: string;
  expenses: number;
  deposit: number;
}

/** Builds the 7 daily bars ending on the most recent transaction date. */
function buildWeeklyBars(transactions: Transaction[]): ChartBar[] {
  if (transactions.length === 0) {
    return [];
  }
  const latest = transactions.reduce(
    (max, transaction) => (transaction.date > max ? transaction.date : max),
    transactions[0].date,
  );
  const [year, month, day] = latest.split('-').map((part) => Number(part));
  const end = Date.UTC(year, (month || 1) - 1, day || 1);

  const bars: ChartBar[] = [];
  const indexByDate = new Map<string, number>();
  for (let offset = CHART_DAYS - 1; offset >= 0; offset -= 1) {
    const isoDate = new Date(end - offset * DAY_MS).toISOString().slice(0, 10);
    indexByDate.set(isoDate, bars.length);
    bars.push({ date: isoDate, expenses: 0, deposit: 0 });
  }

  for (const transaction of transactions) {
    const index = indexByDate.get(transaction.date);
    if (index === undefined) {
      continue;
    }
    if (transaction.kind === 'income') {
      bars[index].deposit += transaction.amount;
    } else {
      bars[index].expenses += transaction.amount;
    }
  }
  return bars;
}

/** The 32×32 dark rounded back square from `icon-32x32.svg`, drawn as SVG. */
function BackControl({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      testID="money-report-back"
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={onPress}
      style={({ pressed }) => [styles.back, pressed ? styles.backPressed : null]}
    >
      <Svg width={32} height={32} viewBox="0 0 32 32">
        <Rect width={32} height={32} rx={7} fill={colors.chartDeposit} />
        <G transform="translate(12.5 9.5)">
          <Path
            d="M0 6.28332L-0.707106 5.57621L-1.41421 6.28332L-0.707106 6.99043L0 6.28332ZM6.28333 0L5.57622 -0.707107L-0.707106 5.57621L0 6.28332L0.707106 6.99043L6.99044 0.707107L6.28333 0ZM0 6.28332L-0.707106 6.99043L5.57622 13.2737L6.28333 12.5666L6.99044 11.8595L0.707106 5.57621L0 6.28332Z"
            fill={colors.onAccent}
            fillRule="nonzero"
          />
        </G>
      </Svg>
    </Pressable>
  );
}

function ChartLegend() {
  return (
    <View style={styles.legend} testID="money-report-legend">
      <View style={styles.legendItem} testID="money-report-legend-expenses">
        <View style={[styles.legendSwatch, { backgroundColor: colors.accent }]} />
        <Text style={styles.legendLabel}>expenses</Text>
      </View>
      <View style={styles.legendItem} testID="money-report-legend-deposit">
        <View
          style={[styles.legendSwatch, { backgroundColor: colors.chartDeposit }]}
        />
        <Text style={styles.legendLabel}>deposit</Text>
      </View>
    </View>
  );
}

export function MoneyReportScreen({ navigation }: MoneyReportScreenProps) {
  const { transactions } = useAppData();

  const groups = useMemo(() => groupByDay(transactions), [transactions]);
  const bars = useMemo(() => buildWeeklyBars(transactions), [transactions]);
  const maxDailyTotal = useMemo(
    () => bars.reduce((max, bar) => Math.max(max, bar.expenses + bar.deposit), 0),
    [bars],
  );
  const scale = maxDailyTotal > 0 ? CHART_HEIGHT / maxDailyTotal : 0;

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="screen-money-report">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <BackControl onPress={() => navigation.goBack()} />
            <Text style={styles.headerTitle}>weekly report</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.chart} testID="money-report-chart">
            {bars.map((bar, index) => (
              <View
                key={bar.date}
                testID={`money-report-bar-${index}`}
                style={styles.barTrack}
              >
                <View
                  style={{
                    width: BAR_WIDTH,
                    height: bar.deposit * scale,
                    backgroundColor: colors.chartDeposit,
                  }}
                />
                <View
                  style={{
                    width: BAR_WIDTH,
                    height: bar.expenses * scale,
                    backgroundColor: colors.accent,
                  }}
                />
              </View>
            ))}
          </View>

          <ChartLegend />
        </View>

        <View style={styles.list}>
          {groups.map((group) => (
            <View
              key={group.date}
              testID={`money-report-day-${group.date}`}
              style={styles.dayGroup}
            >
              {group.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionRow}>
                  <Image
                    source={thumbnailFor(transaction.category)}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.transactionBody}>
                    <Row
                      testID={`money-report-txn-${transaction.id}`}
                      meta={transaction.category}
                      title={transaction.title}
                      subtitle={group.label}
                      amount={transaction.amount}
                      kind={transaction.kind}
                      style={styles.transactionInner}
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgAlt },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: TAB_BAR_HEIGHT },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: screenInset,
    paddingTop: space.s3,
    paddingBottom: space.s5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPressed: { opacity: 0.7 },
  headerTitle: {
    ...type.eyebrow14,
    flex: 1,
    color: colors.black,
    textAlign: 'center',
  },
  headerSpacer: { width: 32, height: 32 },
  chart: {
    height: CHART_HEIGHT,
    marginTop: space.s5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: 256,
    justifyContent: 'space-between',
  },
  barTrack: {
    width: BAR_WIDTH,
    height: CHART_HEIGHT,
    backgroundColor: colors.track,
    borderRadius: radius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: space.s5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: space.s2,
  },
  legendSwatch: {
    width: 13,
    height: 13,
    borderRadius: radius.sm,
    marginRight: space.s0,
  },
  legendLabel: {
    ...type.text9,
    color: colors.black,
  },
  list: {
    paddingTop: space.s2,
    paddingHorizontal: 28,
  },
  dayGroup: { paddingVertical: space.s0 },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.s0,
  },
  thumbnail: {
    width: 53,
    height: 53,
    borderRadius: radius.xxl,
  },
  transactionBody: {
    flex: 1,
    marginLeft: space.s4,
  },
  transactionInner: { minHeight: 83 },
});

export default MoneyReportScreen;
