import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MoneyStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type MoneyScreenProps = NativeStackScreenProps<
  MoneyStackParamList,
  'MoneyList'
>;

/** Scaffold stub for the Money Management list (AC-04 delivered by its ticket). */
export function MoneyScreen(_props: MoneyScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-money-list"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Money Management</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the transaction list is built in a follow-up ticket.
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

export default MoneyScreen;
