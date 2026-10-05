import React, { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, shadows, space, type } from '../theme';

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  invalid?: boolean;
  errorText?: string;
  /** Optional leading icon, as the add-sheet frames draw one in every field. */
  icon?: ReactNode;
  /**
   * Optional leading icon rendered at the left inside the field (DESIGN.md,
   * "Form field"). The caller supplies the bundled icon; the field owns the
   * token-styled slot (16px wide, `space.s3` inset from the edge, `space.s0`
   * gap before the text). Existing usages omit it and render exactly as before.
   */
  leadingIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * A white input box from the add sheets. The error state is only shown when
 * `invalid` is set — the caller decides that after a touch or a save attempt,
 * so an untouched form starts neutral.
 */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  invalid,
  errorText,
  icon,
  leadingIcon,
  style,
  testID,
}: FormFieldProps) {
  const leading = leadingIcon ?? icon;
  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.field,
          multiline ? styles.multiline : null,
          invalid ? styles.invalid : null,
        ]}
      >
        {leading ? (
          <View
            testID={testID ? `${testID}-leading-icon` : undefined}
            style={styles.leading}
          >
            {leading}
          </View>
        ) : null}
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          style={[styles.input, multiline ? styles.inputMultiline : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? label}
          placeholderTextColor={colors.placeholder}
          multiline={multiline}
        />
      </View>
      {invalid && errorText ? (
        <Text testID={testID ? `${testID}-error` : undefined} style={styles.error}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: space.s4,
  },
  field: {
    minHeight: 43,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.s3,
    ...shadows.soft,
  },
  leading: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.s0,
  },
  multiline: {
    minHeight: 90,
    paddingVertical: space.s1,
  },
  invalid: {
    borderWidth: 1,
    borderColor: colors.warmLine,
  },
  input: {
    flex: 1,
    ...type.text16Alt,
    color: colors.fgBody,
    paddingVertical: space.s1,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  error: {
    ...type.text12Alt,
    color: colors.warmLine,
    marginTop: space.s0,
  },
});

export default FormField;
