import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadows, space, type } from '../theme';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * The green call-to-action from the frames: full content width, radius 8,
 * fill #6CC57C, Inter 400 16px white label, at least 44px of touch area.
 */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
  testID,
}: PrimaryButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled === true }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : shadows.soft,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.s3,
    paddingVertical: 10,
  },
  label: {
    ...type.text16Alt,
    color: colors.onAccent,
    textAlign: 'center',
  },
  pressed: {
    backgroundColor: colors.accentSoft,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default PrimaryButton;
