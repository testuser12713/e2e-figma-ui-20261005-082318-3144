import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimeScreen from '../screens/TimeScreen';
import TimeCalendarScreen from '../screens/TimeCalendarScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import { TimeStackParamList } from './types';

const Stack = createNativeStackNavigator<TimeStackParamList>();

/** Time tab: list → calendar / add appointment as stacked states. */
export function TimeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeList" component={TimeScreen} />
      <Stack.Screen name="TimeCalendar" component={TimeCalendarScreen} />
      <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
    </Stack.Navigator>
  );
}

export default TimeStack;
