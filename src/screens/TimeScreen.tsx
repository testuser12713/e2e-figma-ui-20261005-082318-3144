import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TimeStackParamList } from '../navigation/types';
import { colors, screenInset, space, type } from '../theme';

export type TimeScreenProps = NativeStackScreenProps<
  TimeStackParamList,
  'TimeList'
>;

/** Scaffold stub for the Time Management list (AC-05 delivered by its ticket). */
export function TimeScreen(_props: TimeScreenProps) {
  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-time-list"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Time Management</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.note}>
          Placeholder view — the appointment list is built in a follow-up ticket.
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

export default TimeScreen;
