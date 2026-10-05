import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadows } from '../theme';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** White token-styled surface with the design's 20px radius and soft shadow. */
export function Card({ children, style, testID }: CardProps) {
  return (
    <View testID={testID} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadows.card,
  },
});

export default Card;
