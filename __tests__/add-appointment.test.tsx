import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { render, fireEvent, RenderResult } from '@testing-library/react-native';

import { AppDataProvider, useAppData } from '../src/state/AppData';
import AddAppointmentScreen from '../src/screens/AddAppointmentScreen';
import { TimeStackParamList } from '../src/navigation/types';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

const Stack = createNativeStackNavigator<TimeStackParamList>();

/** Renders the newest time entry so a save can be observed end to end. */
function LatestEntryProbe() {
  const { timeEntries } = useAppData();
  const latest = timeEntries[0];
  return (
    <Text testID="probe-entry">
      {`${latest.title}|${latest.category}|${latest.date}|${latest.durationMinutes}`}
    </Text>
  );
}

/** A minimal stand-in for the Time list so `goBack()` has a screen to return to. */
function TimeListStub({
  navigation,
}: NativeStackScreenProps<TimeStackParamList, 'TimeList'>) {
  return (
    <View testID="time-list-stub">
      <Pressable
        testID="open-add-appointment"
        accessibilityRole="button"
        onPress={() => navigation.navigate('AddAppointment')}
      >
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}

function renderSheet() {
  return render(
    <AppDataProvider>
      <LatestEntryProbe />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TimeList" component={TimeListStub} />
          <Stack.Screen
            name="AddAppointment"
            component={AddAppointmentScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppDataProvider>,
  );
}

async function openSheet(view: RenderResult) {
  await fireEvent.press(view.getByTestId('open-add-appointment'));
}

describe('Add Appointment sheet', () => {
  it('fills the form when a Quick Add chip is tapped', async () => {
    const view = await renderSheet();
    await openSheet(view);

    expect(view.getByTestId('appointment-name').props.value).toBe('');

    await fireEvent.press(view.getByTestId('quick-add-gym'));

    expect(view.getByTestId('appointment-name').props.value).toBe('Gym');
    expect(view.getByTestId('appointment-description').props.value).toBe(
      'Customize Plan',
    );
  });

  it('appends the saved appointment and returns to the time list', async () => {
    const view = await renderSheet();
    await openSheet(view);

    await fireEvent.press(view.getByTestId('quick-add-work'));
    await fireEvent.press(view.getByTestId('appointment-date'));
    await fireEvent.press(view.getByTestId('appointment-date-day-15'));
    await fireEvent.press(view.getByTestId('appointment-submit'));

    const probe = view.getByTestId('probe-entry').props.children;
    expect(probe).toContain('Work|Normal Day|');
    expect(probe).toMatch(/\|\d{4}-\d{2}-\d{2}\|60$/);

    expect(view.getByTestId('time-list-stub')).toBeTruthy();
    expect(view.queryByTestId('screen-add-appointment')).toBeNull();
  });

  it('starts neutral and shows the field errors only after a save attempt', async () => {
    const view = await renderSheet();
    await openSheet(view);

    expect(view.queryByTestId('appointment-name-error')).toBeNull();
    expect(view.queryByTestId('appointment-date-error')).toBeNull();

    await fireEvent.press(view.getByTestId('appointment-submit'));

    expect(view.getByTestId('appointment-name-error')).toBeTruthy();
    expect(view.getByTestId('appointment-date-error')).toBeTruthy();
  });
});
