import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import FloatingAddButton from '../components/FloatingAddButton';
import PrimaryButton from '../components/PrimaryButton';
import Row from '../components/Row';
import { TimeEntry } from '../data/types';
import { TimeStackParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import {
  colors,
  radius,
  screenInset,
  shadows,
  space,
  TAB_BAR_HEIGHT,
  type,
} from '../theme';

export type TimeScreenProps = NativeStackScreenProps<
  TimeStackParamList,
  'TimeList'
>;

/**
 * Where the FAB really sits. `fabWrap` pins it `space.s3` above the bottom of
 * this screen (the screen ends at the tab-bar top, it does not include the
 * 77px tab bar) and `FloatingAddButton` is 63px tall, so the FAB's top edge is
 * FAB_CLEARANCE px above the list's bottom edge. The frame's absolute y=778
 * does not apply: the rendered position is what must be cleared.
 */
const FAB_HEIGHT = 63;
const FAB_BOTTOM_OFFSET = space.s3;
export const FAB_CLEARANCE = FAB_HEIGHT + FAB_BOTTOM_OFFSET;

/**
 * DESIGN.md layout: the pinned bottom group (77px tab-bar surface plus the
 * FAB's overhang above it) is 118px tall, so every scrollable list uses that
 * as its bottom content inset and nothing ends up under the FAB or tab bar.
 */
export const LIST_BOTTOM_INSET = TAB_BAR_HEIGHT;

type TimeTab = 'upcoming' | 'past';

const USER_ICON = require('../../design/figma/assets/noun-user-1335326.png');
const PENCIL_ICON = require('../../design/figma/assets/noun-pencil-2174975.png');

/** The 0.5px #1C1C1C divider the frame draws at 20% opacity. */
const DIVIDER = 'rgba(28, 28, 28, 0.2)';
/** Placeholder text is #1C1C1C at 20% opacity in the frame. */
const PLACEHOLDER = 'rgba(28, 28, 28, 0.2)';

function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** The frame writes dates as `09/04/2020` (day/month/year). */
function formatDate(value: string): string {
  const date = parseIsoDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Compact duration, e.g. `30m`, `1h`, `1h 30m`. */
function formatDuration(minutes: number): string {
  const safe = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : 0;
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

function startOfToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function BackChevron() {
  return (
    <Svg width={11} height={18} viewBox="0 0 10.77 18.2">
      <Path
        d="M10.3385 15.8922L3.28952 9.09957L10.3385 2.30693C10.5948 2.0506 10.7443 1.7302 10.7443 1.36707C10.7443 1.00394 10.6162 0.66217 10.3598 0.40585C10.1035 0.14952 9.78312 0 9.41998 0L9.39863 0C9.05686 0 8.71509 0.12816 8.45876 0.38449L0.40585 8.13835C0.14953 8.39468 0 8.73645 0 9.09957C0 9.4627 0.14953 9.82583 0.40585 10.0608L8.48013 17.8147C8.73645 18.0496 9.05686 18.1992 9.41999 18.1992C9.78312 18.1992 10.1249 18.0496 10.3812 17.7933C10.6375 17.537 10.7657 17.1952 10.7657 16.8321C10.7657 16.469 10.6162 16.1272 10.3385 15.8922Z"
        fill="#181461"
        fillRule="evenodd"
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle cx={7} cy={7} r={5.2} fill="none" stroke="#1C1C1C" strokeWidth={1.6} />
      <Path
        d="M11 11L15 15"
        fill="none"
        stroke="#1C1C1C"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/**
 * The Time Management list screen (frame `Time Management`):
 * the "My Appointments" header, the Upcoming/Past switch, a search field that
 * filters as the user types and the appointment list rendered through the
 * shared Row primitive. Rows open the calendar detail state, the FAB and the
 * add button open the Add Appointment sheet.
 */
export function TimeScreen({ navigation }: TimeScreenProps) {
  const { timeEntries } = useAppData();
  const [tab, setTab] = useState<TimeTab>('upcoming');
  const [query, setQuery] = useState('');

  const visibleEntries = useMemo<TimeEntry[]>(() => {
    const today = startOfToday();
    const isUpcoming = (entry: TimeEntry) =>
      parseIsoDate(entry.date).getTime() >= today;
    const upcoming = timeEntries.filter(isUpcoming);
    const past = timeEntries.filter((entry) => !isUpcoming(entry));

    // The frame lists the whole sample schedule under the active "Upcoming"
    // tab, so as long as the dataset has no date from today onwards it stays
    // there; "Past" then holds only genuinely past appointments.
    const hasUpcoming = upcoming.length > 0;
    const source = hasUpcoming
      ? tab === 'past'
        ? past
        : upcoming
      : tab === 'past'
        ? []
        : timeEntries;

    const term = query.trim().toLowerCase();
    const filtered = term
      ? source.filter((entry) =>
          [entry.title, entry.category, formatDate(entry.date)].some((field) =>
            field.toLowerCase().includes(term),
          ),
        )
      : source;

    return [...filtered].sort((a, b) => {
      const delta =
        parseIsoDate(a.date).getTime() - parseIsoDate(b.date).getTime();
      return tab === 'past' ? -delta : delta;
    });
  }, [timeEntries, tab, query]);

  const openCalendar = () => navigation.navigate('TimeCalendar');
  const openAdd = () => navigation.navigate('AddAppointment');

  const renderItem = ({ item }: { item: TimeEntry }) => (
    <View style={styles.rowWrap}>
      <Row
        testID={`time-row-${item.id}`}
        style={styles.row}
        meta={formatDate(item.date)}
        metaStyle={styles.rowMeta}
        title={item.title}
        subtitle={`${item.category} · ${formatDuration(item.durationMinutes)}`}
        subtitleStyle={styles.rowSubtitle}
        onPress={openCalendar}
      />
      <Pressable
        testID={`time-modify-${item.id}`}
        accessibilityRole="button"
        accessibilityLabel={`Modify ${item.title}`}
        accessibilityState={{ disabled: true }}
        disabled
        style={styles.modify}
      >
        <Image source={PENCIL_ICON} style={styles.pencil} accessible={false} />
        <Text style={styles.modifyText}>Modify</Text>
      </Pressable>
    </View>
  );

  const empty = (
    <View testID="time-list-empty" style={styles.empty}>
      <Text style={styles.emptyText}>
        {tab === 'past' ? 'No past appointments.' : 'No appointments found.'}
      </Text>
    </View>
  );

  const footer = (
    <View testID="time-list-footer" style={styles.footer}>
      <PrimaryButton
        testID="time-add-button"
        label="Add a new appointment"
        onPress={openAdd}
      />
      <PrimaryButton
        testID="time-overview-button"
        label="Overview"
        onPress={openCalendar}
        disabled
        style={styles.overviewButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="screen-time-list">
      <View style={styles.headerBlock}>
        <View style={styles.headerBar}>
          <Pressable
            testID="time-open-calendar"
            accessibilityRole="button"
            accessibilityLabel="Open calendar"
            onPress={openCalendar}
            style={styles.backButton}
          >
            <BackChevron />
          </Pressable>
          <Pressable
            testID="time-profile"
            accessibilityRole="button"
            accessibilityLabel="Profile"
            accessibilityState={{ disabled: true }}
            disabled
            style={styles.avatarButton}
          >
            <Image source={USER_ICON} style={styles.avatar} accessible={false} />
          </Pressable>
        </View>

        <Text style={styles.title}>My Appointments</Text>

        <View style={styles.searchField}>
          <TextInput
            testID="time-search-input"
            accessibilityLabel="Search appointments"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={PLACEHOLDER}
            returnKeyType="search"
          />
          <SearchIcon />
        </View>

        <View style={styles.tabsRow}>
          <Pressable
            testID="time-tab-upcoming"
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'upcoming' }}
            hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
            onPress={() => setTab('upcoming')}
            style={styles.tab}
          >
            <Text
              style={tab === 'upcoming' ? styles.tabActive : styles.tabInactive}
            >
              Upcoming
            </Text>
            <View
              style={[
                styles.underline,
                tab === 'upcoming' ? styles.underlineActive : null,
              ]}
            />
          </Pressable>

          <Pressable
            testID="time-tab-past"
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'past' }}
            hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
            onPress={() => setTab('past')}
            style={[styles.tab, styles.tabRight]}
          >
            <Text style={tab === 'past' ? styles.tabActive : styles.tabInactive}>
              Past
            </Text>
            <View
              style={[
                styles.underline,
                styles.underlineRight,
                tab === 'past' ? styles.underlineActive : null,
              ]}
            />
          </Pressable>
        </View>
        <View style={styles.track} />
      </View>

      <FlatList
        testID="time-list"
        style={styles.list}
        data={visibleEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />

      <View
        testID="time-fab-wrap"
        style={styles.fabWrap}
        pointerEvents="box-none"
      >
        <FloatingAddButton
          testID="time-add-fab"
          label="Add an appointment"
          onPress={openAdd}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerBlock: {
    paddingHorizontal: screenInset,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 27,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: -8,
    marginBottom: -8,
  },
  avatarButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: -8,
    opacity: 0.4,
  },
  avatar: {
    width: 27,
    height: 27,
  },
  title: {
    ...type.text16,
    color: colors.fgBody,
    marginTop: space.s6,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 43,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space.s3,
    marginTop: space.s3,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    ...type.text16Alt,
    color: colors.fgBody,
    paddingVertical: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.s6,
  },
  tab: {
    alignItems: 'flex-start',
  },
  tabRight: {
    alignItems: 'flex-end',
  },
  tabActive: {
    ...type.text16,
    color: colors.fg,
  },
  tabInactive: {
    ...type.text16Alt,
    color: colors.fgBody,
  },
  underline: {
    width: 51,
    height: 2,
    marginTop: space.s3,
    backgroundColor: 'transparent',
  },
  underlineRight: {
    alignSelf: 'flex-end',
  },
  underlineActive: {
    backgroundColor: colors.fg,
  },
  track: {
    height: 1,
    backgroundColor: DIVIDER,
  },
  list: {
    flex: 1,
    // End the scrollable viewport at the FAB's top edge. Content is clipped
    // above this line, so neither a row nor the CTA can ever be rendered
    // underneath the FAB at any scroll offset — only the footer scrolls into
    // view from below it.
    marginBottom: FAB_CLEARANCE,
  },
  listContent: {
    paddingHorizontal: screenInset,
    // DESIGN.md's 118px bottom inset: no row and no button scrolls under the
    // FAB or the tab bar.
    paddingBottom: LIST_BOTTOM_INSET,
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flex: 1,
  },
  /**
   * The frame's date line: Inter 400 12px/22px #1C1C1C at 40% opacity, and the
   * category/duration line below the title in the same muted body style. The
   * shared Row's default meta/subtitle styles stay untouched for Money/Dashboard.
   */
  rowMeta: {
    ...type.text12Alt,
    lineHeight: 22,
    color: colors.fgBody,
    opacity: 0.4,
  },
  rowSubtitle: {
    ...type.text12Alt,
    color: colors.fgBody,
    opacity: 0.4,
  },
  modify: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: space.s2,
    opacity: 0.4,
  },
  pencil: {
    width: 12,
    height: 12,
    marginRight: space.s0,
  },
  modifyText: {
    ...type.text14,
    color: colors.fg,
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: space.s7,
  },
  emptyText: {
    ...type.text14Alt,
    color: colors.mutedAlt,
    textAlign: 'center',
  },
  footer: {
    marginTop: space.s6,
    gap: space.s5,
  },
  overviewButton: {
    backgroundColor: colors.accentTranslucent,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: space.s3,
    alignItems: 'center',
  },
});

export default TimeScreen;
