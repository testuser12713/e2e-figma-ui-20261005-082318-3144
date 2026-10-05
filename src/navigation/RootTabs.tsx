import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import {
  colors,
  isWeb,
  shadows,
  space,
  TAB_BAR_HEIGHT,
  TAB_BAR_SURFACE_HEIGHT,
  type,
} from '../theme';
import DashboardStack from './DashboardStack';
import MoneyStack from './MoneyStack';
import TimeStack from './TimeStack';
import { RootTabParamList } from './types';

// react-native-screens ships disabled on the web build, so the bottom-tab
// navigator falls back to a scene container that never hides a blurred scene:
// every tab stayed stacked and the visible screen never swapped (AC-02). On web
// the library then has to be switched on explicitly, which makes its `Screen`
// toggle `display: none` on the inactive scene so exactly the focused tab is
// rendered. On native screens are already enabled and the call is a no-op.
if (isWeb) {
  enableScreens(true);
}

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
        // The white surface is only the bottom 77px of the 118px bar group
        // (DESIGN.md); the top 41px is the notch the floating add button sits
        // over, so it stays transparent instead of extending the white bar.
        tabBarBackground: () => <View style={styles.barSurface} />,
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
    // The bar group is 118px tall; its white surface (drawn behind the items)
    // is the bottom 77px, so the 41px notch above stays transparent.
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: TAB_BAR_HEIGHT,
    paddingTop: TAB_BAR_HEIGHT - TAB_BAR_SURFACE_HEIGHT,
  },
  barSurface: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_SURFACE_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 0,
    ...shadows.nav,
  },
  label: {
    ...type.text7,
    // DESIGN.md types the label at 7px/5px, but a line box shorter than the
    // font clips the glyph's bottom edge (AC-10). Give the line the font's
    // height so every label reads fully; the layout itself is unchanged.
    lineHeight: 10,
    marginTop: 4,
  },
  item: {
    minHeight: 48,
    paddingTop: space.s1,
  },
});

export default RootTabs;
