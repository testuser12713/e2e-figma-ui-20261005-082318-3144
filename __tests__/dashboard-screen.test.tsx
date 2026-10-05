import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { AppShell } from '../App';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

/**
 * Dashboard screen (this slice): the figures shown are computed from the shared
 * sample data by the AppData provider, the two enabled management entries switch
 * to their parent tab, the menu control opens the Dashboard Menu route and the
 * entries without a function this sprint are visibly disabled.
 */
describe('Dashboard screen', () => {
  it('boots on the Dashboard and shows the figures from the sample data', async () => {
    const view = await render(<AppShell />);

    expect(view.getByTestId('screen-dashboard-home')).toBeTruthy();
    expect(view.getByTestId('dashboard-title')).toHaveTextContent('Dashboard');

    // income 4170, expenses 308.90, balance 3861.10, tracked 375 min = 6h 15m
    expect(view.getByTestId('dashboard-balance')).toHaveTextContent('3,861.10€');
    expect(view.getByTestId('dashboard-income')).toHaveTextContent('4,170.00€');
    expect(view.getByTestId('dashboard-expenses')).toHaveTextContent('308.90€');
    expect(view.getByTestId('dashboard-time')).toHaveTextContent('6h 15m');
  });

  it('switches to the Money tab from the Money Management entry', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('dashboard-card-money'));

    expect(view.getByTestId('screen-money-list')).toBeTruthy();
  });

  it('switches to the Time tab from the Time Management entry', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('dashboard-card-time'));

    expect(view.getByTestId('screen-time-list')).toBeTruthy();
  });

  it('opens the Dashboard Menu from the menu control', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('dashboard-menu-button'));

    expect(view.getByTestId('screen-dashboard-menu')).toBeTruthy();
  });

  it('renders the Food and App Management entries visibly disabled', async () => {
    const view = await render(<AppShell />);

    const food = view.getByTestId('dashboard-card-food');
    const app = view.getByTestId('dashboard-card-app');
    const search = view.getByTestId('dashboard-search');

    expect(food).toBeDisabled();
    expect(app).toBeDisabled();
    expect(search).toBeDisabled();

    await fireEvent.press(food);
    await fireEvent.press(app);

    // A disabled entry must not navigate anywhere.
    expect(view.getByTestId('screen-dashboard-home')).toBeTruthy();
    expect(view.queryByTestId('screen-dashboard-menu')).toBeNull();
  });
});
