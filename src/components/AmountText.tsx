import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { colors, formatAmount, type } from '../theme';
import { TransactionKind } from '../data/types';

export interface AmountTextProps {
  amount: number;
  /** Expenses read green and incomes/deposits dark, verbatim from the frames. */
  kind?: TransactionKind;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** Formats an amount exactly as the design does: `1,345.00€`. */
export function AmountText({ amount, kind, style, testID }: AmountTextProps) {
  const color =
    kind === 'expense'
      ? colors.accent
      : kind === 'income'
        ? colors.chartDeposit
        : colors.fgBody;
  return (
    <Text testID={testID} style={[styles.text, { color }, style]}>
      {formatAmount(amount)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...type.amountRow,
    color: colors.fgBody,
    textAlign: 'right',
  },
});

export default AmountText;
