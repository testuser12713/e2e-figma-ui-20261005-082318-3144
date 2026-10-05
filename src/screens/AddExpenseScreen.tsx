import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Svg, { Path, Rect } from 'react-native-svg';

import { MoneyStackParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import { colors, radius, screenInset, space, type } from '../theme';
import FormField from '../components/FormField';
import DatePickerField from '../components/DatePickerField';
import PrimaryButton from '../components/PrimaryButton';

export type AddExpenseScreenProps = NativeStackScreenProps<
  MoneyStackParamList,
  'AddExpense'
>;

/** The dark 32×32 rounded-square back control from `icon-32x32.svg`. */
function BackIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Rect x={0} y={0} width={32} height={32} rx={7} fill="#2B2B2B" />
      <Path
        transform="translate(12.5, 9.5)"
        d="M0 6.28332L-0.707106 5.57621L-1.41421 6.28332L-0.707106 6.99043L0 6.28332ZM6.28333 0L5.57622 -0.707107L-0.707106 5.57621L0 6.28332L0.707106 6.99043L6.99044 0.707107L6.28333 0ZM0 6.28332L-0.707106 6.99043L5.57622 13.2737L6.28333 12.5666L6.99044 11.8595L0.707106 5.57621L0 6.28332Z"
        fill="#FFFFFF"
        fillRule="nonzero"
      />
    </Svg>
  );
}

/** Parses the Amount field: accepts `12.5` and the German `12,5`, rejects <= 0. */
function parseAmount(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const value = Number(trimmed.replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Money Management 3 — the Add Expense sheet. Name / Beschreibung / Amount /
 * Select Date feed `addTransaction` and the screen closes back to the money
 * list. Validation stays neutral until a field is touched or saving is tried.
 */
export function AddExpenseScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MoneyStackParamList, 'AddExpense'>>();
  const { addTransaction } = useAppData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);

  const [touched, setTouched] = useState({
    name: false,
    amount: false,
    date: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const parsedAmount = parseAmount(amount);
  const nameValid = name.trim().length > 0;
  const amountValid = parsedAmount !== null;
  const dateValid = date !== null;

  const showNameError = (touched.name || submitted) && !nameValid;
  const showAmountError = (touched.amount || submitted) && !amountValid;
  const showDateError = (touched.date || submitted) && !dateValid;

  const touch = (field: 'name' | 'amount' | 'date') => {
    setTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!nameValid || !amountValid || !dateValid || parsedAmount === null || date === null) {
      return;
    }
    addTransaction({
      title: name.trim(),
      category: 'Other',
      date: toIsoDate(date),
      amount: parsedAmount,
      kind: 'expense',
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="screen-add-expense">
      <View style={styles.header}>
        <Pressable
          testID="add-expense-back"
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          hitSlop={6}
          style={styles.back}
        >
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Add Expense</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="Name"
          testID="add-expense-name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            touch('name');
          }}
          invalid={showNameError}
          errorText="Please enter a name"
        />

        <FormField
          label="Beschreibung"
          testID="add-expense-description"
          value={description}
          onChangeText={setDescription}
        />

        <FormField
          label="Amount"
          testID="add-expense-amount"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            touch('amount');
          }}
          invalid={showAmountError}
          errorText="Please enter a valid amount"
        />

        <View style={styles.dateBlock}>
          <DatePickerField
            label="Select Date"
            testID="add-expense-date"
            value={date}
            placeholder="Select Date"
            onChange={(picked) => {
              setDate(picked);
              touch('date');
            }}
            style={[styles.dateField, showDateError ? styles.dateInvalid : null]}
          />
          {showDateError ? (
            <Text testID="add-expense-date-error" style={styles.dateError}>
              Please select a date
            </Text>
          ) : null}
        </View>

        <PrimaryButton
          label="Add Expense"
          testID="add-expense-submit"
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgAlt },
  header: {
    backgroundColor: colors.surface,
    minHeight: 138,
    paddingHorizontal: screenInset,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 32,
    height: 32,
  },
  title: {
    ...type.eyebrow14,
    color: colors.black,
    marginLeft: space.s7,
  },
  scroll: { flex: 1 },
  body: {
    paddingHorizontal: screenInset,
    paddingTop: space.s7,
    paddingBottom: space.s6,
  },
  dateBlock: {
    marginBottom: space.s4,
  },
  dateField: {
    marginBottom: 0,
  },
  dateInvalid: {
    borderWidth: 1,
    borderColor: colors.warmLine,
    borderRadius: radius.lg,
  },
  dateError: {
    ...type.text12Alt,
    color: colors.warmLine,
    marginTop: space.s0,
  },
});

export default AddExpenseScreen;
