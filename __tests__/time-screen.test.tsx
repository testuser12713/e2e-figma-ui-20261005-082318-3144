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

  it('keeps the add CTA clear of the floating add button zone', async () => {
    const view = await renderTime();

    const flatten = (style: unknown) =>
      StyleSheet.flatten(style as never) as {
        paddingBottom?: number;
        gap?: number;
        minHeight?: number;
      };

    const listInset =
      flatten(view.getByTestId('time-list').props.contentContainerStyle)
        .paddingBottom ?? 0;
    const footer = flatten(view.getByTestId('time-list-footer').props.style);
    const cta = flatten(view.getByTestId('time-add-button').props.style);
    const overview = flatten(
      view.getByTestId('time-overview-button').props.style,
    );

    // DESIGN.md layout: the list reserves a 118px bottom inset.
    expect(listInset).toBe(118);

    // DESIGN.md geometry of the 414×896 frame: the FAB is 64×63 with its
    // circle bottom at y=841, so its top edge sits at y=778; the tab-bar
    // surface starts at y=819.
    const SCREEN_HEIGHT = 896;
    const FAB_TOP = 841 - 63;

    // At the end of the scroll the content bottom sits `listInset` above the
    // frame bottom; the Overview button and the footer gap sit below the add
    // CTA, pushing the CTA's bottom edge that much higher.
    const belowCta =
      listInset +
      (footer.paddingBottom ?? 0) +
      (overview.minHeight ?? 0) +
      (footer.gap ?? 0);
    const ctaBottom = SCREEN_HEIGHT - belowCta;
    const ctaTop = ctaBottom - (cta.minHeight ?? 0);

    // The CTA's bottom edge stays above the FAB's top edge and its top edge
    // stays at or above y 750, so the FAB never covers its label.
    expect(ctaBottom).toBeLessThan(FAB_TOP);
    expect(ctaTop).toBeLessThanOrEqual(750);
  });
});
