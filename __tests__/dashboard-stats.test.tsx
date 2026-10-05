import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import DashboardStatsScreen from '../src/screens/DashboardStatsScreen';
import { AppDataProvider } from '../src/state/AppData';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

async function renderStats() {
  const navigate = jest.fn();
  const navigation = { navigate } as never;
  const route = { key: 'dashboard-stats', name: 'DashboardStats' } as never;

  const view = await render(
    <AppDataProvider>
      <DashboardStatsScreen navigation={navigation} route={route} />
    </AppDataProvider>,
  );

  return { view, navigate };
}

describe('DashboardStatsScreen', () => {
  it('renders the Statistics header and the frame period labels', async () => {
    const { view } = await renderStats();

    expect(view.getByTestId('screen-dashboard-stats')).toBeTruthy();
    expect(view.getByText('Statistics')).toBeTruthy();
    expect(view.getByTestId('stats-since').props.children).toBe('Since 21. Dec');
    expect(view.getByTestId('stats-range').props.children).toBe(
      'Dec 2024 - Jan 2024',
    );
    expect(view.getByTestId('stats-total-value').props.children).toBe('20');
    expect(view.getByTestId('stats-total-unit').props.children).toBe('DAYS');
  });

  it('renders the month axis and one bar per month exactly as the frame', async () => {
    const { view } = await renderStats();

    const axis = view
      .getAllByTestId(/^stats-axis-/)
      .map((node) => node.props.children);

    expect(axis).toEqual(['M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'M', 'A']);
    expect(view.getAllByTestId(/^stats-bar-/)).toHaveLength(axis.length);
  });

  it('renders the frame scale values 60, 70, 80 and 90', async () => {
    const { view } = await renderStats();

    for (const value of [60, 70, 80, 90]) {
      expect(view.getByTestId(`stats-scale-${value}`)).toBeTruthy();
    }
  });

  it('derives the bar heights from the shared app data', async () => {
    const { view } = await renderStats();

    const heights = view.getAllByTestId(/^stats-bar-/).map((node) => {
      const flat = StyleSheet.flatten(node.props.style) as {
        height?: number;
      } | null;
      return flat?.height ?? 0;
    });

    expect(Math.max(...heights)).toBeGreaterThan(0);
    expect(view.getByTestId('stats-peak-tooltip')).toBeTruthy();
  });

  it('returns to the Dashboard menu from the back control', async () => {
    const { view, navigate } = await renderStats();

    await fireEvent.press(view.getByTestId('dashboard-stats-back'));
    expect(navigate).toHaveBeenCalledWith('DashboardMenu');
  });

  it('switches the selected period when a switch segment is pressed', async () => {
    const { view } = await renderStats();

    expect(
      view.getByTestId('stats-period-Y').props.accessibilityState.selected,
    ).toBe(true);

    await fireEvent.press(view.getByTestId('stats-period-D'));

    expect(
      view.getByTestId('stats-period-D').props.accessibilityState.selected,
    ).toBe(true);
    expect(
      view.getByTestId('stats-period-Y').props.accessibilityState.selected,
    ).toBe(false);
  });
});
