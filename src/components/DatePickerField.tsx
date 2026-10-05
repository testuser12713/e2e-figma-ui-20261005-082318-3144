import React, { ReactNode, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadows, space, type } from '../theme';

export interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  /** Optional leading icon, as the add-sheet frames draw one in every field. */
  icon?: ReactNode;
  /**
   * Optional leading icon rendered at the left inside the field, mirroring
   * `FormField.leadingIcon` (DESIGN.md, "Form field"). Existing usages omit it.
   */
  leadingIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * A real in-app calendar picker: the field is pressable and opens a month grid
 * where the user taps a day. There is no free-text date entry anywhere.
 */
export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select Date',
  icon,
  leadingIcon,
  style,
  testID,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => value ?? new Date());

  const cells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      result.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      result.push(new Date(year, month, day));
    }
    while (result.length % 7 !== 0) {
      result.push(null);
    }
    return result;
  }, [visibleMonth]);

  const openPicker = () => {
    setVisibleMonth(value ?? new Date());
    setOpen(true);
  };

  const shiftMonth = (delta: number) => {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  };

  const selectDay = (day: Date) => {
    onChange(day);
    setOpen(false);
  };

  const leading = leadingIcon ?? icon;

  return (
    <View style={[styles.wrap, style]}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={openPicker}
        style={({ pressed }) => [styles.field, pressed ? styles.pressed : null]}
      >
        {leading ? (
          <View
            testID={testID ? `${testID}-leading-icon` : undefined}
            style={styles.leading}
          >
            {leading}
          </View>
        ) : null}
        <Text
          style={[
            styles.fieldText,
            value ? styles.valueText : styles.placeholderText,
          ]}
        >
          {value ? toIsoDate(value) : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Close date picker"
            onPress={() => setOpen(false)}
          />
          <View style={styles.calendar} testID={testID ? `${testID}-calendar` : undefined}>
            <View style={styles.calendarHeader}>
              <Pressable
                testID={testID ? `${testID}-prev` : undefined}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() => shiftMonth(-1)}
                style={styles.navButton}
              >
                <Text style={styles.navText}>{'<'}</Text>
              </Pressable>
              <Text style={styles.monthLabel}>
                {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </Text>
              <Pressable
                testID={testID ? `${testID}-next` : undefined}
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() => shiftMonth(1)}
                style={styles.navButton}
              >
                <Text style={styles.navText}>{'>'}</Text>
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {WEEKDAYS.map((day, index) => (
                <Text key={`weekday-${index}`} style={styles.weekday}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.cell} />;
                }
                const selected = value !== null && isSameDay(day, value);
                return (
                  <Pressable
                    key={`day-${day.getDate()}`}
                    testID={testID ? `${testID}-day-${day.getDate()}` : undefined}
                    accessibilityRole="button"
                    accessibilityLabel={toIsoDate(day)}
                    onPress={() => selectDay(day)}
                    style={[styles.cell, selected ? styles.selectedCell : null]}
                  >
                    <Text style={selected ? styles.selectedDay : styles.day}>
                      {day.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: space.s4,
  },
  field: {
    minHeight: 43,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.s3,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.8,
  },
  leading: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.s0,
  },
  fieldText: {
    flex: 1,
  },
  valueText: {
    ...type.text16Alt,
    color: colors.fgBody,
  },
  placeholderText: {
    ...type.text16Alt,
    color: colors.placeholder,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.shadowHeader,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.s4,
  },
  calendar: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space.s4,
    ...shadows.soft,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.s3,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    ...type.text16,
    color: colors.fg,
  },
  monthLabel: {
    ...type.text16,
    color: colors.fg,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    ...type.text12Alt,
    color: colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  selectedCell: {
    backgroundColor: colors.accent,
  },
  day: {
    ...type.text14Alt,
    color: colors.fgBody,
  },
  selectedDay: {
    ...type.text14Alt,
    color: colors.onAccent,
  },
});

export default DatePickerField;
