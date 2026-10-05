import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { render, fireEvent, within } from '@testing-library/react-native';

import { AppShell } from '../App';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

/**
 * AC-02 / AC-10: the bottom tab bar swaps the visible screen, every tab is
 * reachable, and the label's line box is tall enough that the glyph's bottom
 * edge — the one the 7px/5px token used to clip — stays inside the bar.
 */
describe('RootTabs bottom bar', () => {
  const LABELS: Array<[string, string]> = [
    ['tab-dashboard', 'Dashboard'],
    ['tab-money', 'Money'],
    ['tab-time', 'Time'],
  ];

  it.each(LABELS)(
    'renders the %s label without clipping its glyph',
    async (testID, label) => {
      const view = await render(<AppShell />);

      const style = StyleSheet.flatten(
        within(view.getByTestId(testID)).getByText(label).props.style,
      ) as TextStyle;

      expect(style.fontSize).toBe(7);
      expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize as number);
    },
  );
});

/**
 * Regression for "Make every tab press bring that tab's list screen to the
 * front": the tab bar alone must always reveal the tab's list, even after a
 * detail screen was pushed inside the tab's nested stack. React Navigation
 * v7's JS tab bar only navigates an unfocused tab; it does not reset the
 * nested stack, so a pushed detail stayed on top.
 */
describe('bottom tab press restores the tab list', () => {
  it('pops a pushed Money detail when the Money tab is pressed again', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('tab-money'));
    expect(view.getByTestId('screen-money-list')).toBeTruthy();

    const [firstRow] = view.getAllByTestId(/^transaction-row-/);
    await fireEvent.press(firstRow);
    expect(view.getByTestId('screen-money-report')).toBeTruthy();

    await fireEvent.press(view.getByTestId('tab-money'));
    expect(view.getByTestId('screen-money-list')).toBeTruthy();
    expect(view.queryByTestId('screen-money-report')).toBeNull();
  });

  it('restores the Money list after visiting another tab from a pushed detail', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('tab-money'));
    const [firstRow] = view.getAllByTestId(/^transaction-row-/);
    await fireEvent.press(firstRow);
    expect(view.getByTestId('screen-money-report')).toBeTruthy();

    await fireEvent.press(view.getByTestId('tab-dashboard'));
    expect(view.getByTestId('screen-dashboard-home')).toBeTruthy();

    await fireEvent.press(view.getByTestId('tab-money'));
    expect(view.getByTestId('screen-money-list')).toBeTruthy();
    expect(view.queryByTestId('screen-money-report')).toBeNull();
  });
});
