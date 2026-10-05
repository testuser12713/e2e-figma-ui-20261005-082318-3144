import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';

export interface SectionHeaderProps {
  title: string;
  testID?: string;
}

/** Aleo 16px heading used above a grouped block of content. */
export function SectionHeader({ title, testID }: SectionHeaderProps) {
  return (
    <View style={styles.wrap} testID={testID}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: space.s2,
  },
  title: {
    ...type.text16,
    color: colors.fg,
  },
});

export default SectionHeader;
