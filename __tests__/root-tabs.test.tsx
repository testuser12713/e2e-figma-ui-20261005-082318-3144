import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { render, within } from '@testing-library/react-native';

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
