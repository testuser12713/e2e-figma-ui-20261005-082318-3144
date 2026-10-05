import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, shadows } from '../theme';

export interface FloatingAddButtonProps {
  onPress: () => void;
  label?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * The 64×63 green gradient FAB that floats over the bottom tab bar (white
 * 4px inner stroke, shadow). Renders a white cross, exactly as the frames do.
 */
export function FloatingAddButton({
  onPress,
  label = 'Add',
  testID,
  style,
}: FloatingAddButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [pressed ? styles.pressed : null, style]}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentGradientEnd]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.circle}
      >
        <View style={styles.crossHorizontal} />
        <View style={styles.crossVertical} />
      </LinearGradient>
    </Pressable>
  );
}

const SIZE = 64;

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE - 1,
    borderRadius: SIZE / 2,
    borderWidth: 4,
    borderColor: colors.onAccent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: colors.onAccent,
  },
  crossVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: colors.onAccent,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default FloatingAddButton;
