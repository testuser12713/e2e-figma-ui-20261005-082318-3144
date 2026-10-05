import React, { useCallback } from 'react';
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
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { DashboardStackParamList, RootTabParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import {
  colors,
  fontFamily,
  formatAmount,
  radius,
  screenInset,
  shadows,
  space,
  type,
} from '../theme';

export type DashboardScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardHome'
>;

/**
 * The Dashboard home view of the "businesshandler" frames: green header with the
 * menu control and avatar, the (this sprint: disabled) search field, the summary
 * figures computed from the shared app data and the four management entries.
 *
 * Time Management and Money Management switch to their tab through the parent
 * tab navigator; Food Management and App Management have no function this sprint
 * and are rendered visibly disabled (AC-03, AC-08).
 */
export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { totals } = useAppData();

  const openTab = useCallback(
    (tab: keyof RootTabParamList) => {
      const parent =
        navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
      parent?.navigate(tab);
    },
    [navigation],
  );

  const openMenu = useCallback(
    () => navigation.navigate('DashboardMenu'),
    [navigation],
  );

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
      testID="screen-dashboard-home"
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            testID="dashboard-menu-button"
            accessibilityRole="button"
            accessibilityLabel="Open dashboard menu"
            onPress={openMenu}
            hitSlop={12}
            style={({ pressed }) => [
              styles.menuButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <MenuIcon />
          </Pressable>
          <Image
            source={require('../../design/figma/assets/noun-user-1335326-ffffff.png')}
            style={styles.avatar}
            accessible={false}
          />
        </View>
        <Text testID="dashboard-title" style={styles.headerTitle}>
          Dashboard
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          testID="dashboard-search"
          accessibilityState={{ disabled: true }}
          accessibilityLabel="Search"
          style={styles.search}
        >
          <Text style={styles.searchText}>Search</Text>
          <View style={styles.searchIcon}>
            <SearchIcon />
          </View>
        </View>

        <View testID="dashboard-summary" style={styles.summary}>
          <Metric
            label="Balance"
            value={formatAmount(totals.balance)}
            testID="dashboard-balance"
          />
          <Metric
            label="Income"
            value={formatAmount(totals.income)}
            testID="dashboard-income"
          />
          <Metric
            label="Expenses"
            value={formatAmount(totals.expenses)}
            testID="dashboard-expenses"
          />
          <Metric
            label="Tracked Time"
            value={formatDuration(totals.totalMinutes)}
            testID="dashboard-time"
          />
        </View>

        <View style={styles.grid}>
          <ManagementCard
            testID="dashboard-card-time"
            title="Time Management"
            image={require('../../design/figma/assets/illustration-128x114.png')}
            imageWidth={128}
            imageHeight={114}
            onPress={() => openTab('Time')}
          />
          <ManagementCard
            testID="dashboard-card-money"
            title="Money Management"
            image={require('../../design/figma/assets/illustration-118x109.png')}
            imageWidth={118}
            imageHeight={109}
            onPress={() => openTab('Money')}
          />
        </View>

        <View style={styles.grid}>
          <ManagementCard
            testID="dashboard-card-app"
            title="App Management"
            image={require('../../design/figma/assets/illustration-120x133.png')}
            imageWidth={120}
            imageHeight={133}
            disabled
          />
          <ManagementCard
            testID="dashboard-card-food"
            title="Food Management"
            image={require('../../design/figma/assets/undraw-personal-site-xyd1.png')}
            imageWidth={88}
            imageHeight={130}
            disabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Whole tracked time total, e.g. `6h 15m` (or `45m` below one hour). */
function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function Metric({
  label,
  value,
  testID,
}: {
  label: string;
  value: string;
  testID: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text testID={testID} style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

interface ManagementCardProps {
  title: string;
  image: ImageSourcePropType;
  imageWidth: number;
  imageHeight: number;
  onPress?: () => void;
  disabled?: boolean;
  testID: string;
}

function ManagementCard({
  title,
  image,
  imageWidth,
  imageHeight,
  onPress,
  disabled,
  testID,
}: ManagementCardProps) {
  const interactive = Boolean(onPress) && !disabled;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled === true }}
      disabled={!interactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        disabled ? styles.cardDisabled : null,
        pressed && interactive ? styles.cardPressed : null,
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardArt}>
        <Image
          source={image}
          style={{ width: imageWidth, height: imageHeight }}
          resizeMode="contain"
          accessible={false}
        />
      </View>
    </Pressable>
  );
}

/** The frame renders `noun_menu_933312` empty; drawn from its outline. */
function MenuIcon() {
  return (
    <Svg width={18} height={15} viewBox="0 0 18 15">
      <Rect x={0} y={0} width={18} height={2} rx={1} fill={colors.fgInverse} />
      <Rect x={0} y={6.5} width={18} height={2} rx={1} fill={colors.fgInverse} />
      <Rect x={0} y={13} width={18} height={2} rx={1} fill={colors.fgInverse} />
    </Svg>
  );
}

/** The frame renders `noun_Search_860389` empty; drawn from its outline. */
function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle
        cx={7}
        cy={7}
        r={5}
        fill="none"
        stroke={colors.fgBody}
        strokeWidth={1.6}
      />
      <Line
        x1={10.7}
        y1={10.7}
        x2={15}
        y2={15}
        stroke={colors.fgBody}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.accent },
  header: {
    height: 126,
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingTop: 25,
    ...shadows.soft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    marginLeft: -13,
    paddingLeft: 13,
  },
  avatar: { width: 27, height: 27, borderRadius: 14 },
  headerTitle: {
    ...type.text24,
    color: colors.fgInverse,
    marginTop: 10,
  },
  pressed: { opacity: 0.7 },
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: screenInset,
    paddingTop: 39,
    paddingBottom: space.s7,
  },
  search: {
    minHeight: 43,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: space.s3,
    paddingRight: 18,
    ...shadows.soft,
  },
  searchText: {
    ...type.text16Alt,
    color: colors.fgBody,
    opacity: 0.2,
  },
  searchIcon: { opacity: 0.2 },
  summary: {
    marginTop: space.s4,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.s3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...shadows.soft,
  },
  metric: {
    width: '50%',
    marginBottom: space.s2,
    paddingRight: space.s2,
  },
  metricLabel: {
    ...type.text10,
    color: colors.mutedAlt,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 18,
    lineHeight: 22,
    color: colors.fg,
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
    marginTop: space.s4,
  },
  card: {
    flex: 1,
    minHeight: 280,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: 15,
    paddingTop: 19,
    paddingBottom: 15,
    ...shadows.soft,
  },
  cardPressed: { opacity: 0.85 },
  cardDisabled: { opacity: 0.4 },
  cardTitle: {
    ...type.text16,
    color: colors.fg,
  },
  cardArt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.s2,
  },
});

export default DashboardScreen;
