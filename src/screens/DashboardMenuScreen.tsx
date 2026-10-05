import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type DashboardMenuScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardMenu'
>;

/** Scaffold stub for the Dashboard menu overlay state. */
export function DashboardMenuScreen(_props: DashboardMenuScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-dashboard-menu"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Menu</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the menu state is built in a follow-up ticket.
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

export default DashboardMenuScreen;
