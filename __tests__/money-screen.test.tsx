import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import MoneyScreen from '../src/screens/MoneyScreen';
import { AppDataProvider } from '../src/state/AppData';
import { transactions } from '../src/data/transactions';
import { colors, formatAmount } from '../src/theme';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

async function renderMoneyScreen() {
  const navigate = jest.fn();
  const parentNavigate = jest.fn();
  const navigation = {
    navigate,
    getParent: () => ({ navigate: parentNavigate }),
  } as never;
  const route = { key: 'money-list', name: 'MoneyList' } as never;

  const view = await render(
    <AppDataProvider>
      <MoneyScreen navigation={navigation} route={route} />
    </AppDataProvider>,
  );

  return { view, navigate, parentNavigate };
}

describe('MoneyScreen', () => {
  it('lists every sample transaction with title, category, date and amount', async () => {
    const { view } = await renderMoneyScreen();

    expect(transactions.length).toBeGreaterThanOrEqual(8);

    for (const transaction of transactions) {
      // Titles and categories repeat in the sample data, so assert presence.
      expect(view.getAllByText(transaction.title).length).toBeGreaterThan(0);
      expect(view.getAllByText(transaction.category).length).toBeGreaterThan(0);
      expect(view.getByTestId(`transaction-row-${transaction.id}`)).toBeTruthy();
    }

    // Dates repeat across transactions, so assert presence rather than uniqueness.
    expect(view.getAllByText(transactions[0].date).length).toBeGreaterThan(0);
    expect(view.getAllByText(transactions[1].date).length).toBeGreaterThan(0);
  });

  it('shows the monthly expense sum from the shared totals', async () => {
    const expected = transactions
      .filter((transaction) => transaction.kind === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const { view } = await renderMoneyScreen();

    expect(view.getByTestId('money-expenses-total').props.children).toBe(
      formatAmount(expected),
    );
  });

  it('styles income amounts differently from expenses', async () => {
    const { view } = await renderMoneyScreen();

    const expenseRow = view.getByTestId('transaction-row-txn-002');
    const incomeRow = view.getByTestId('transaction-row-txn-001');

    const expenseAmount = view.getByText(formatAmount(23));
    const incomeAmount = view.getByText(formatAmount(3200));

    expect(expenseRow).toBeTruthy();
    expect(incomeRow).toBeTruthy();

    const flatten = (style: unknown) =>
      StyleSheet.flatten(style as never) as { color?: string };

    expect(flatten(expenseAmount.props.style).color).toBe(colors.accent);
    expect(flatten(incomeAmount.props.style).color).toBe(colors.chartDeposit);
  });

  it('opens the MoneyReport route from the header card and a transaction row', async () => {
    const { view, navigate } = await renderMoneyScreen();

    await fireEvent.press(view.getByTestId('money-header-card'));
    expect(navigate).toHaveBeenCalledWith('MoneyReport');

    navigate.mockClear();

    await fireEvent.press(view.getByTestId('transaction-row-txn-003'));
    expect(navigate).toHaveBeenCalledWith('MoneyReport');
  });

  it('opens the AddExpense route from the floating add button', async () => {
    const { view, navigate } = await renderMoneyScreen();

    await fireEvent.press(view.getByTestId('money-add-button'));
    expect(navigate).toHaveBeenCalledWith('AddExpense');
  });

  it('returns to the Dashboard tab from the header back chevron', async () => {
    const { view, parentNavigate } = await renderMoneyScreen();

    const chevron = view.getByTestId('money-back-button');
    // The frame shows it as a live control, so it must not carry the disabled look.
    expect(chevron.props.accessibilityState?.disabled).not.toBe(true);
    expect(chevron.props.pointerEvents).not.toBe('none');

    await fireEvent.press(chevron);
    expect(parentNavigate).toHaveBeenCalledWith('Dashboard');
  });
});
