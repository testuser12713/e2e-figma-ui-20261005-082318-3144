import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/DashboardScreen';
import DashboardMenuScreen from '../screens/DashboardMenuScreen';
import DashboardStatsScreen from '../screens/DashboardStatsScreen';
import { DashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

/** Dashboard tab: home → menu / stats as stacked states inside the tab. */
export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="DashboardMenu" component={DashboardMenuScreen} />
      <Stack.Screen name="DashboardStats" component={DashboardStatsScreen} />
    </Stack.Navigator>
  );
}

export default DashboardStack;
