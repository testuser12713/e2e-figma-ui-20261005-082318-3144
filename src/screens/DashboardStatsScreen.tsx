import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type DashboardStatsScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardStats'
>;

/** Scaffold stub for the Dashboard statistics state. */
export function DashboardStatsScreen(_props: DashboardStatsScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-dashboard-stats"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the statistics state is built in a follow-up ticket.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
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

export default DashboardStatsScreen;
