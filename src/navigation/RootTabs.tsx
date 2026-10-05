import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, shadows, type } from '../theme';
import DashboardStack from './DashboardStack';
import MoneyStack from './MoneyStack';
import TimeStack from './TimeStack';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={21} viewBox="0 0 24 24">
      <Path
        d="M12 3 2.5 11h2.6v9.5h5.1V15h3.6v5.5h5.1V11h2.6L12 3Z"
        fill={color}
      />
    </Svg>
  );
}

function MoneyIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={21} viewBox="0 0 24 24">
      <Rect x={2} y={6} width={20} height={13} rx={2.5} fill={color} />
      <Circle cx={12} cy={12.5} r={3} fill={colors.surface} />
      <Rect x={16} y={9} width={4} height={2.4} rx={1} fill={colors.surface} />
    </Svg>
  );
}

function TimeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={21} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} fill="none" stroke={color} strokeWidth={2.2} />
      <Path d="M12 6.5V12l3.8 2.4" stroke={color} strokeWidth={2.2} fill="none" />
    </Svg>
  );
}

/**
 * The bottom tab bar: Dashboard / Money / Time. Every tab is pressable with a
 * stable testID and an accessibility role, and the active tab is highlighted
 * (green icon + label) so the switch is visible at a glance.
 */
export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarButtonTestID: 'tab-dashboard',
          tabBarAccessibilityLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Money"
        component={MoneyStack}
        options={{
          tabBarButtonTestID: 'tab-money',
          tabBarAccessibilityLabel: 'Money Management',
          tabBarIcon: ({ color }) => <MoneyIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Time"
        component={TimeStack}
        options={{
          tabBarButtonTestID: 'tab-time',
          tabBarAccessibilityLabel: 'Time Management',
          tabBarIcon: ({ color }) => <TimeIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 0,
    paddingTop: 6,
    height: 77,
    ...shadows.nav,
  },
  label: {
    ...type.text7,
    marginTop: 2,
  },
  item: {
    minHeight: 48,
  },
});

export default RootTabs;
