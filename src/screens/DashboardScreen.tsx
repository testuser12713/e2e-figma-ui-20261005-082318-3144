import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type DashboardScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardHome'
>;

/**
 * Scaffold stub for the Dashboard home view (AC-01/AC-03 are delivered by the
 * Dashboard screen ticket). It renders the registered route so the app boots
 * onto the Dashboard tab.
 */
export function DashboardScreen(_props: DashboardScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-dashboard-home"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the Dashboard content is built in a follow-up ticket.
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

export default DashboardScreen;
