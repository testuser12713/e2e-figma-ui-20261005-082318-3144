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
import Svg, { Circle, Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TimeStackParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import { TimeEntry } from '../data/types';
import { colors, fontFamily, radius, space, type } from '../theme';

export type TimeCalendarScreenProps = NativeStackScreenProps<
  TimeStackParamList,
  'TimeCalendar'
>;

/** Weekday header of the date strip, Sunday first, exactly as the frame. */
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Assets named by the frame's spec (`design/figma/time-management-2.md`).
const chevronLeft = require('../../design/figma/assets/icon-8x14.png');
const chevronDown = require('../../design/figma/assets/icon-10x6.png');
const eventAvatar = require('../../design/figma/assets/fc8cc65f046eeb0b9efb159aad932e2b.png');

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** Compact duration, e.g. `30m`, `1h`, `1h 30m`. */
function formatDuration(minutes: number): string {
  const safe =
    Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : 0;
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  if (hours === 0) {
    return `${rest}m`;
  }
  if (rest === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${rest}m`;
}

/** The frame's agenda date separator, e.g. `18 April 2019`. */
function formatLongDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Local calendar date as the sprint's `YYYY-MM-DD` contract. */
function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) {
    return null;
  }
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Midnight local copy of a date, so day arithmetic never drifts with time. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const start = startOfDay(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * The week the screen opens on. The design frame mocks a fixed 2019 week; the
 * running product instead opens on the week of the first appointment so the
 * entry markers are visible immediately.
 */
function defaultDate(entries: TimeEntry[]): Date {
  for (const entry of entries) {
    const parsed = parseIsoDate(entry.date);
    if (parsed !== null) {
      return parsed;
    }
  }
  return startOfDay(new Date());
}

function formatRange(start: Date, end: Date): string {
  const startMonth = MONTH_NAMES[start.getMonth()];
  const endMonth = MONTH_NAMES[end.getMonth()];
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}-${end.getDate()} ${startMonth} ${start.getFullYear()}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${start.getFullYear()}`;
  }
  return `${start.getDate()} ${startMonth} ${start.getFullYear()} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
}

/**
 * The 11×11 clock the frame draws inside the event block. Figma exports this
 * asset empty, so it is drawn from the frame's outlines in #23233C.
 */
function ClockIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11">
      <Circle
        cx={5.5}
        cy={5.5}
        r={4.7}
        fill="none"
        stroke="#23233C"
        strokeWidth={0.9}
      />
      <Path
        d="M5.5 3.1V5.7L7.1 6.6"
        fill="none"
        stroke="#23233C"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * The calendar state of Time Management ("Time Management - 2"): the "My
 * Appointments" header, the week range navigator, the weekday letters and a
 * tappable date strip. The selected day carries the frame's green circle and a
 * small dot marks every day that has appointments in the shared app data.
 * Below the strip the selected day's appointments render as the frame's green
 * agenda blocks, with a plain hint when the day carries no entry.
 */
export function TimeCalendarScreen(_props: TimeCalendarScreenProps) {
  const { timeEntries } = useAppData();

  const entriesPerDate = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of timeEntries) {
      counts.set(entry.date, (counts.get(entry.date) ?? 0) + 1);
    }
    return counts;
  }, [timeEntries]);

  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    defaultDate(timeEntries),
  );
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeek(defaultDate(timeEntries)),
  );

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const rangeLabel = formatRange(weekDates[0], weekDates[6]);

  const selectedIso = toIsoDate(selectedDate);
  const selectedEntries = useMemo(
    () => timeEntries.filter((entry) => entry.date === selectedIso),
    [timeEntries, selectedIso],
  );

  const shiftWeek = (deltaDays: number) => {
    setWeekStart((current) => addDays(current, deltaDays));
    setSelectedDate((current) => addDays(current, deltaDays));
  };

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-time-calendar"
    >
      <View style={styles.headerBlock}>
        <Text style={styles.title} testID="calendar-title">
          My Appointments
        </Text>

        <View style={styles.weekNav}>
          <Pressable
            testID="calendar-prev-week"
            accessibilityRole="button"
            accessibilityLabel="Previous week"
            onPress={() => shiftWeek(-7)}
            style={({ pressed }) => [
              styles.navButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Image
              source={chevronLeft}
              style={styles.chevron}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.rangeLabel} testID="calendar-range-label">
            {rangeLabel}
          </Text>

          <Pressable
            testID="calendar-next-week"
            accessibilityRole="button"
            accessibilityLabel="Next week"
            onPress={() => shiftWeek(7)}
            style={({ pressed }) => [
              styles.navButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Image
              source={chevronLeft}
              style={[styles.chevron, styles.chevronFlipped]}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAY_LETTERS.map((letter, index) => (
            <Text
              key={`weekday-${index}`}
              style={styles.weekday}
              testID={`calendar-weekday-${index}`}
            >
              {letter}
            </Text>
          ))}
        </View>

        <View style={styles.dayRow}>
          {weekDates.map((date) => {
            const isoDate = toIsoDate(date);
            const entryCount = entriesPerDate.get(isoDate) ?? 0;
            const selected = isSameDay(date, selectedDate);
            const label =
              entryCount > 0
                ? `${isoDate}, ${entryCount} appointment${entryCount === 1 ? '' : 's'}`
                : isoDate;
            return (
              <Pressable
                key={isoDate}
                testID={`calendar-day-${isoDate}`}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected }}
                onPress={() => setSelectedDate(date)}
                style={({ pressed }) => [
                  styles.dayCell,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View
                  style={[
                    styles.dayCircle,
                    selected ? styles.dayCircleSelected : null,
                  ]}
                >
                  <Text style={styles.dayNumber}>{date.getDate()}</Text>
                  {entryCount > 0 ? (
                    <View
                      testID={`calendar-day-${isoDate}-entry`}
                      style={[
                        styles.entryDot,
                        selected ? styles.entryDotSelected : null,
                      ]}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.handleWrap} pointerEvents="none">
          <View style={styles.handle}>
            <Image
              source={chevronDown}
              style={styles.handleIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.agenda}
        contentContainerStyle={styles.agendaContent}
        showsVerticalScrollIndicator={false}
        testID="calendar-agenda"
      >
        <Text style={styles.dateSeparator} testID="calendar-agenda-date">
          {formatLongDate(selectedDate)}
        </Text>

        {selectedEntries.length === 0 ? (
          <Text style={styles.emptyHint} testID="calendar-agenda-empty">
            No appointments on this day.
          </Text>
        ) : (
          selectedEntries.map((entry) => (
            <View
              key={entry.id}
              style={styles.agendaRow}
              testID={`calendar-agenda-block-${entry.id}`}
            >
              <View style={styles.timeGutter}>
                <Text style={styles.timeLabel}>
                  {formatDuration(entry.durationMinutes)}
                </Text>
                <View style={styles.gutterTick} />
              </View>

              <View
                style={styles.eventBlock}
                testID={`calendar-agenda-card-${entry.id}`}
              >
                <View style={styles.eventBody}>
                  <Text style={styles.eventCategory}>{entry.category}</Text>
                  <Text style={styles.eventTitle}>{entry.title}</Text>
                  <View style={styles.eventTimeRow}>
                    <ClockIcon />
                    <Text style={styles.eventTime}>
                      {formatDuration(entry.durationMinutes)}
                    </Text>
                  </View>
                </View>
                <Image
                  source={eventAvatar}
                  style={styles.eventAvatar}
                  resizeMode="cover"
                  accessible={false}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CALENDAR_INSET = space.s3;
const CHEVRON_WIDTH = 8;
const CHEVRON_HEIGHT = 14;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBlock: {
    backgroundColor: colors.surface,
    paddingTop: space.s1,
    overflow: 'visible',
  },
  title: {
    ...type.ubuntu17,
    color: colors.black,
    textAlign: 'center',
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.s6,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: CHEVRON_WIDTH,
    height: CHEVRON_HEIGHT,
  },
  chevronFlipped: {
    transform: [{ scaleX: -1 }],
  },
  rangeLabel: {
    ...type.ubuntu13,
    color: colors.black,
    marginHorizontal: space.s7,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: CALENDAR_INSET,
    marginTop: space.s6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    ...type.ubuntu15,
    color: colors.black,
  },
  dayRow: {
    flexDirection: 'row',
    paddingHorizontal: CALENDAR_INSET,
    marginTop: space.s3,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.accent,
  },
  dayNumber: {
    ...type.ubuntu15,
    color: colors.black,
  },
  entryDot: {
    position: 'absolute',
    bottom: 6,
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  entryDotSelected: {
    backgroundColor: colors.onAccent,
  },
  pressed: {
    opacity: 0.7,
  },
  handleWrap: {
    alignItems: 'center',
    marginTop: space.s3,
    marginBottom: -17,
  },
  handle: {
    width: 164,
    height: 34,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xxxl,
    borderBottomRightRadius: radius.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIcon: {
    width: 10,
    height: 6,
  },
  agenda: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  agendaContent: {
    paddingTop: space.s6,
    paddingBottom: 120,
    paddingHorizontal: 34,
  },
  dateSeparator: {
    ...type.ubuntu11,
    color: colors.black,
    opacity: 0.44,
    marginBottom: space.s5,
  },
  emptyHint: {
    ...type.text14Alt,
    color: colors.mutedAlt,
  },
  agendaRow: {
    flexDirection: 'row',
    marginBottom: 17,
  },
  timeGutter: {
    width: 60,
    alignItems: 'flex-start',
    paddingTop: space.s1,
  },
  timeLabel: {
    fontFamily: fontFamily.heading,
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.3,
    color: colors.black,
  },
  /* The 22×1 #707070 tick the frame draws at 18% under every gutter label. */
  gutterTick: {
    width: 22,
    height: 1,
    marginTop: 'auto',
    marginBottom: 30,
    backgroundColor: 'rgba(112, 112, 112, 0.18)',
  },
  eventBlock: {
    flex: 1,
    minHeight: 118,
    flexDirection: 'row',
    backgroundColor: colors.accentBlock,
    borderRadius: radius.sm,
    paddingLeft: 20,
    paddingRight: 15,
    paddingTop: 13,
    paddingBottom: space.s2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 139, 48, 0.18)',
  },
  eventBody: {
    flex: 1,
  },
  eventCategory: {
    ...type.ubuntu11,
    color: colors.fg,
    marginBottom: space.s3,
  },
  eventTitle: {
    ...type.ubuntu10,
    color: colors.black,
    opacity: 0.42,
    marginBottom: space.s1,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    ...type.ubuntu7,
    color: colors.fg,
    marginLeft: 2,
  },
  eventAvatar: {
    width: 56,
    height: 56,
    marginLeft: space.s2,
  },
});

export default TimeCalendarScreen;
