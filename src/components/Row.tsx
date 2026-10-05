import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { colors, space, type } from '../theme';
import { TransactionKind } from '../data/types';
import AmountText from './AmountText';

export interface RowProps {
  title: string;
  subtitle?: string;
  meta?: string;
  amount?: number;
  kind?: TransactionKind;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  metaStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * A list row: meta/eyebrow above the title, optional subtitle below, an
 * optional right-aligned amount. Tappable when `onPress` is given; a row that
 * cannot be interacted with is rendered visibly disabled instead of silently dead.
 */
export function Row({
  title,
  subtitle,
  meta,
  amount,
  kind,
  onPress,
  disabled,
  style,
  metaStyle,
  subtitleStyle,
  testID,
}: RowProps) {
  const isInteractive = Boolean(onPress) && !disabled;
  const content = (
    <View style={styles.content}>
      <View style={styles.textBlock}>
        {meta ? (
          <Text style={[styles.meta, metaStyle]}>{meta}</Text>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
        ) : null}
      </View>
      {typeof amount === 'number' ? (
        <AmountText amount={amount} kind={kind} />
      ) : null}
    </View>
  );

  if (!isInteractive) {
    return (
      <View
        testID={testID}
        accessibilityState={{ disabled: disabled === true }}
        style={[styles.row, disabled ? styles.disabled : null, style]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    justifyContent: 'center',
    paddingVertical: space.s2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    paddingRight: space.s3,
  },
  meta: {
    ...type.text9,
    color: colors.fgBody,
    marginBottom: 2,
  },
  title: {
    ...type.text16,
    color: colors.fgBody,
  },
  subtitle: {
    ...type.text12Alt,
    color: colors.mutedAlt,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Row;
