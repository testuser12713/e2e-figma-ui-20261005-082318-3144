import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import DashboardMenuScreen from '../src/screens/DashboardMenuScreen';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

async function renderMenu() {
  const navigate = jest.fn();
  const goBack = jest.fn();
  const navigation = { navigate, goBack } as never;
  const route = { key: 'dashboard-menu', name: 'DashboardMenu' } as never;

  const view = await render(
    <DashboardMenuScreen navigation={navigation} route={route} />,
  );

  return { view, navigate, goBack };
}

const DISABLED_ENTRIES = [
  'menu-entry-account-settings',
  'menu-entry-help',
  'menu-entry-logout',
];

describe('DashboardMenuScreen', () => {
  it('renders the profile header and the four menu entries', async () => {
    const { view } = await renderMenu();

    expect(view.getByTestId('screen-dashboard-menu')).toBeTruthy();
    expect(view.getByTestId('dashboard-menu-profile')).toBeTruthy();
    expect(view.getByTestId('dashboard-menu-profile-name').props.children).toBe(
      'Sophie Garnier',
    );
    expect(
      view.getByTestId('dashboard-menu-profile-location').props.children,
    ).toBe('Luxembourg');

    expect(view.getByTestId('menu-entry-statistics')).toBeTruthy();
    expect(view.getByTestId('menu-entry-account-settings')).toBeTruthy();
    expect(view.getByTestId('menu-entry-help')).toBeTruthy();
    expect(view.getByTestId('menu-entry-logout')).toBeTruthy();
  });

  it('opens the DashboardStats route from the Statistics entry', async () => {
    const { view, navigate } = await renderMenu();

    await fireEvent.press(view.getByTestId('menu-entry-statistics'));

    expect(navigate).toHaveBeenCalledWith('DashboardStats');
  });

  it('returns to the dashboard from the close control and the backdrop', async () => {
    const { view, goBack } = await renderMenu();

    await fireEvent.press(view.getByTestId('dashboard-menu-close'));
    expect(goBack).toHaveBeenCalledTimes(1);

    await fireEvent.press(view.getByTestId('dashboard-menu-backdrop'));
    expect(goBack).toHaveBeenCalledTimes(2);
  });

  it('marks the entries without a function as disabled with a hint', async () => {
    const { view, navigate } = await renderMenu();

    for (const testID of DISABLED_ENTRIES) {
      const entry = view.getByTestId(testID);
      expect(entry.props.accessibilityState?.disabled ?? entry.props['aria-disabled']).toBe(
        true,
      );
      expect(view.getByTestId(`${testID}-hint`).props.children).toBe(
        'Coming soon',
      );
    }

    await fireEvent.press(view.getByTestId('menu-entry-help'));
    await fireEvent.press(view.getByTestId('menu-entry-account-settings'));
    await fireEvent.press(view.getByTestId('menu-entry-logout'));

    expect(navigate).not.toHaveBeenCalled();
  });
});
