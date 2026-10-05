import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MoneyStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type MoneyReportScreenProps = NativeStackScreenProps<
  MoneyStackParamList,
  'MoneyReport'
>;

/** Scaffold stub for the weekly report chart state. */
export function MoneyReportScreen(_props: MoneyReportScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-money-report"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Report</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the weekly report is built in a follow-up ticket.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgAlt },
  header: {
    paddingHorizontal: screenInset,
    paddingTop: space.s3,
    paddingBottom: space.s3,
  },
  title: { ...type.text24, color: colors.fg },
  body: {
    flex: 1,
    paddingHorizontal: screenInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    ...type.text14Alt,
    color: colors.mutedAlt,
    textAlign: 'center',
  },
});

export default MoneyReportScreen;
