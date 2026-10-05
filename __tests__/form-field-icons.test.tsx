import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import FormField from '../src/components/FormField';
import DatePickerField from '../src/components/DatePickerField';

function CustomIcon() {
  return <View testID="custom-leading-icon" />;
}

describe('FormField leading icon', () => {
  it('renders the caller icon in the leading slot when provided', async () => {
    const view = await render(
      <FormField
        label="Name"
        testID="name-field"
        value=""
        onChangeText={() => {}}
        leadingIcon={<CustomIcon />}
      />,
    );

    expect(view.getByTestId('name-field-leading-icon')).toBeTruthy();
    expect(view.getByTestId('custom-leading-icon')).toBeTruthy();
    expect(view.getByTestId('name-field')).toBeTruthy();
  });

  it('renders no leading slot when the icon is omitted (backward compatible)', async () => {
    const view = await render(
      <FormField
        label="Name"
        testID="plain-field"
        value=""
        onChangeText={() => {}}
      />,
    );

    expect(view.queryByTestId('plain-field-leading-icon')).toBeNull();
    expect(view.getByTestId('plain-field')).toBeTruthy();
  });
});

describe('DatePickerField leading icon', () => {
  it('renders the caller icon in the leading slot when provided', async () => {
    const view = await render(
      <DatePickerField
        label="Select Date"
        testID="date-field"
        value={null}
        onChange={() => {}}
        leadingIcon={<CustomIcon />}
      />,
    );

    expect(view.getByTestId('date-field-leading-icon')).toBeTruthy();
    expect(view.getByTestId('custom-leading-icon')).toBeTruthy();
    expect(view.getByTestId('date-field')).toBeTruthy();
  });

  it('renders no leading slot when the icon is omitted', async () => {
    const view = await render(
      <DatePickerField
        label="Select Date"
        testID="date-field"
        value={null}
        onChange={() => {}}
      />,
    );

    expect(view.queryByTestId('date-field-leading-icon')).toBeNull();
  });

  it('still opens the in-app calendar when the field is pressed', async () => {
    const view = await render(
      <DatePickerField
        label="Select Date"
        testID="date-field"
        value={null}
        onChange={() => {}}
      />,
    );

    await fireEvent.press(view.getByTestId('date-field'));
    expect(view.getByTestId('date-field-calendar')).toBeTruthy();
  });
});
