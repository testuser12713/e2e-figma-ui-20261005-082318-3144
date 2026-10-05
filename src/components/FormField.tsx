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
  style,
  testID,
}: FormFieldProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.field,
          multiline ? styles.multiline : null,
          invalid ? styles.invalid : null,
        ]}
      >
        {icon ? <View style={styles.leadingIcon}>{icon}</View> : null}
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
    justifyContent: 'center',
    paddingHorizontal: space.s2,
    ...shadows.soft,
  },
  leadingIcon: {
    marginRight: space.s1,
    alignItems: 'center',
    justifyContent: 'center',
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
