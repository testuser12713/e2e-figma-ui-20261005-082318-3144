import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

import { AppDataProvider } from '../src/state/AppData';
import TimeStack from '../src/navigation/TimeStack';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

function renderTime() {
  return render(
    <AppDataProvider>
      <NavigationContainer>
        <TimeStack />
      </NavigationContainer>
    </AppDataProvider>,
  );
}

describe('Time Management list screen', () => {
  it('lists at least five sample appointments with title, category, date and duration', async () => {
    const view = await renderTime();

    const rows = view.getAllByTestId(/^time-row-/);
    expect(rows.length).toBeGreaterThanOrEqual(5);

    expect(view.getByText('Dentist - Clara Odding')).toBeTruthy();
    expect(view.getAllByText('09/04/2020').length).toBeGreaterThanOrEqual(1);
    expect(view.getByText('Health · 1h')).toBeTruthy();
  });

  it('filters the appointment list as the user types', async () => {
    const view = await renderTime();

    await fireEvent.changeText(view.getByTestId('time-search-input'), 'cardio');

    expect(view.getByText('Cardiologist - Steven Pauliner')).toBeTruthy();
    expect(view.queryByText('Dentist - Clara Odding')).toBeNull();
    expect(view.getAllByTestId(/^time-row-/).length).toBe(1);
  });

  it('switches the shown entries between Upcoming and Past', async () => {
    const view = await renderTime();

    expect(view.getAllByTestId(/^time-row-/).length).toBeGreaterThanOrEqual(5);

    await fireEvent.press(view.getByTestId('time-tab-past'));
    expect(view.getByTestId('time-list-empty')).toBeTruthy();
    expect(view.queryAllByTestId(/^time-row-/).length).toBe(0);

    await fireEvent.press(view.getByTestId('time-tab-upcoming'));
    expect(view.getAllByTestId(/^time-row-/).length).toBeGreaterThanOrEqual(5);
  });

  it('renders the frame controls without a function this sprint as visibly disabled', async () => {
    const view = await renderTime();

    expect(
      view.getByTestId('time-overview-button').props.accessibilityState
        ?.disabled,
    ).toBe(true);
    expect(
      view.getByTestId('time-modify-time-001').props.accessibilityState
        ?.disabled,
    ).toBe(true);
    expect(view.getByTestId('time-profile').props.accessibilityState?.disabled).toBe(
      true,
    );
  });

  it('opens the calendar route from the header control', async () => {
    const view = await renderTime();

    await fireEvent.press(view.getByTestId('time-open-calendar'));

    expect(view.getByTestId('screen-time-calendar')).toBeTruthy();
  });

  it('opens the Add Appointment route from the floating add button', async () => {
    const view = await renderTime();

    await fireEvent.press(view.getByTestId('time-add-fab'));

    expect(view.getByTestId('screen-add-appointment')).toBeTruthy();
  });

  it('opens the Add Appointment route from the add appointment button', async () => {
    const view = await renderTime();

    await fireEvent.press(view.getByTestId('time-add-button'));

    expect(view.getByTestId('screen-add-appointment')).toBeTruthy();
  });

  it('ends the list above the floating add button so the CTA is never covered', async () => {
    const view = await renderTime();

    const flatten = (style: unknown) =>
      StyleSheet.flatten(style as never) as {
        bottom?: number;
        height?: number;
        marginBottom?: number;
        paddingBottom?: number;
      };

    // Read the FAB's rendered geometry instead of the design frame's numbers.
    const fabWrap = flatten(view.getByTestId('time-fab-wrap').props.style);
    const fabChildren = view.getByTestId('time-add-fab').props.children;
    const fabCircleStyle = (
      Array.isArray(fabChildren) ? fabChildren : [fabChildren]
    )
      .map((child: { props?: { style?: unknown } } | null) =>
        child?.props ? child.props.style : undefined,
      )
      .find((style: unknown) => typeof flatten(style).height === 'number');
    const fabSize = flatten(fabCircleStyle);

    const fabBottomOffset = fabWrap.bottom ?? 0;
    const fabHeight = fabSize.height ?? 0;
    // The FAB claims the bottom `offset + height` px of the screen.
    const fabZone = fabBottomOffset + fabHeight;

    const list = flatten(view.getByTestId('time-list').props.style);
    const listBottomInset = list.marginBottom ?? 0;
    const contentBottomInset =
      flatten(view.getByTestId('time-list').props.contentContainerStyle)
        .paddingBottom ?? 0;

    // The rendered FAB has a real height sitting a real offset above the
    // screen bottom; that whole zone must be cleared.
    expect(fabHeight).toBeGreaterThan(0);
    expect(listBottomInset).toBeGreaterThanOrEqual(fabZone);

    // The list content also keeps DESIGN.md's 118px bottom inset.
    expect(contentBottomInset).toBe(118);
  });
});
