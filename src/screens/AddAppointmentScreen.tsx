import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TimeStackParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import { colors, screenInset, shadows, space, type } from '../theme';
import { DatePickerField } from '../components/DatePickerField';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';

export type AddAppointmentScreenProps = NativeStackScreenProps<
  TimeStackParamList,
  'AddAppointment'
>;

/** The icons the frame renders empty; drawn from its outlines to match. */
function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle
        cx={6.6}
        cy={6.6}
        r={4.6}
        stroke={colors.fg}
        strokeWidth={1.6}
        fill="none"
      />
      <Path
        d="M10.2 10.2 L14.4 14.4"
        stroke={colors.fg}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MapIcon() {
  return (
    <Svg width={14} height={18} viewBox="0 0 14 18">
      <Path
        d="M7 1 C3.9 1 1.5 3.4 1.5 6.5 C1.5 10.6 7 16.5 7 16.5 C7 16.5 12.5 10.6 12.5 6.5 C12.5 3.4 10.1 1 7 1 Z"
        fill="none"
        stroke={colors.fg}
        strokeWidth={1.5}
      />
      <Circle cx={7} cy={6.5} r={2} fill={colors.fg} />
    </Svg>
  );
}

function MenuIcon() {
  return (
    <Svg width={18} height={15} viewBox="0 0 18 15">
      <Rect x={0} y={0} width={18} height={1.6} rx={0.8} fill={colors.iconInk} />
      <Rect x={0} y={6.7} width={18} height={1.6} rx={0.8} fill={colors.iconInk} />
      <Rect x={0} y={13.4} width={18} height={1.6} rx={0.8} fill={colors.iconInk} />
    </Svg>
  );
}

function FilterIcon() {
  return (
    <Svg width={25} height={22} viewBox="0 0 25 22">
      <Path d="M1 1 H24 L15 11 V21 L10 18 V11 Z" fill={colors.fg} />
    </Svg>
  );
}

function QuickDots() {
  return (
    <Svg width={3} height={14} viewBox="0 0 3 14">
      <Circle cx={1.5} cy={1.5} r={1.5} fill={colors.fg} />
      <Circle cx={1.5} cy={7} r={1.5} fill={colors.fg} />
      <Circle cx={1.5} cy={12.5} r={1.5} fill={colors.fg} />
    </Svg>
  );
}

/**
 * A Quick Add row from the frame. Tapping it fills the sheet with that
 * appointment: the bold title becomes the Name, the muted line the
 * Beschreibung and (because the frame has no category field) the category.
 */
interface QuickAdd {
  key: string;
  title: string;
  subtitle: string;
  category: string;
  image: ImageSourcePropType;
}

const QUICK_ADDS: QuickAdd[] = [
  {
    key: 'gym',
    title: 'Gym',
    subtitle: 'Customize Plan',
    category: 'Customize Plan',
    image: require('../../design/figma/assets/image-69x69.png'),
  },
  {
    key: 'work',
    title: 'Work',
    subtitle: 'Normal Day',
    category: 'Normal Day',
    image: require('../../design/figma/assets/image-69x69-2.png'),
  },
  {
    key: 'birthday',
    title: 'Birthday',
    subtitle: 'Friend',
    category: 'Friend',
    image: require('../../design/figma/assets/image-69x69-4.png'),
  },
  {
    key: 'doctor',
    title: 'Dr. Jeff Smiths',
    subtitle: 'Dermatologist',
    category: 'Dermatologist',
    image: require('../../design/figma/assets/image-69x69-3.png'),
  },
];

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** ISO `YYYY-MM-DD`, the contract of `TimeEntry.date`. */
function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Time Management - 3: the add appointment sheet. */
export function AddAppointmentScreen({ navigation }: AddAppointmentScreenProps) {
  const { addTimeEntry } = useAppData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<QuickAdd | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // An untouched form is neutral: errors only appear once the user has typed
  // into the field or pressed 'Add Appointment' (AC-07).
  const nameError = (nameTouched || submitAttempted) && name.trim() === '';
  const dateError = submitAttempted && date === null;

  const handleNameChange = (text: string) => {
    setName(text);
    setNameTouched(true);
  };

  const handleQuickAdd = (item: QuickAdd) => {
    setName(item.title);
    setDescription(item.subtitle);
    setSelectedQuickAdd(item);
    setNameTouched(true);
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    const trimmedName = name.trim();
    if (trimmedName === '' || date === null) {
      return;
    }
    addTimeEntry({
      title: trimmedName,
      category: selectedQuickAdd ? selectedQuickAdd.category : 'Other',
      date: toIsoDate(date),
      durationMinutes: 60,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="screen-add-appointment"
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <MenuIcon />
          <Image
            source={require('../../design/figma/assets/noun-user-1335326-181461.png')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.headerTitle}>Add an appointment</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="Name"
          value={name}
          onChangeText={handleNameChange}
          icon={<SearchIcon />}
          invalid={nameError}
          errorText="Please enter a name"
          testID="appointment-name"
        />

        <FormField
          label="Beschreibung"
          value={description}
          onChangeText={setDescription}
          icon={<MapIcon />}
          testID="appointment-description"
        />

        <View style={styles.dateBlock}>
          <DatePickerField
            label="Select Date"
            value={date}
            onChange={setDate}
            icon={
              <Image
                source={require('../../design/figma/assets/icon-15x16.png')}
                style={styles.dateIcon}
              />
            }
            style={styles.dateField}
            testID="appointment-date"
          />
          {dateError ? (
            <Text
              testID="appointment-date-error"
              style={styles.dateError}
            >
              Please select a date
            </Text>
          ) : null}
        </View>

        <PrimaryButton
          label="Add Appointment"
          onPress={handleSubmit}
          testID="appointment-submit"
        />

        <View style={styles.quickHeader}>
          <Text style={styles.quickHeaderText}>Quick Adds</Text>
          <FilterIcon />
        </View>

        <View style={styles.quickList}>
          {QUICK_ADDS.map((item) => (
            <Pressable
              key={item.key}
              testID={`quick-add-${item.key}`}
              accessibilityRole="button"
              accessibilityLabel={`Quick add ${item.title}`}
              onPress={() => handleQuickAdd(item)}
              style={({ pressed }) => [
                styles.quickRow,
                pressed ? styles.quickRowPressed : null,
              ]}
            >
              <View style={styles.quickContent}>
                <Image source={item.image} style={styles.quickImage} />
                <View style={styles.quickText}>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                  <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
                </View>
                <QuickDots />
              </View>
              <View style={styles.quickDivider} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: space.s3,
    paddingBottom: space.s5,
    ...shadows.soft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 27,
  },
  avatar: { width: 27, height: 27 },
  headerTitle: {
    ...type.text24,
    color: colors.fg,
    marginTop: space.s2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: screenInset,
    paddingTop: space.s5,
    paddingBottom: space.s7,
  },
  dateBlock: {
    marginBottom: space.s4,
  },
  dateField: {
    marginBottom: 0,
  },
  dateIcon: { width: 15, height: 16 },
  dateError: {
    ...type.text12Alt,
    color: colors.warmLine,
    marginTop: space.s0,
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.s6,
  },
  quickHeaderText: {
    ...type.text16Alt,
    color: colors.fgBody,
  },
  quickList: {
    marginTop: space.s3,
  },
  quickRow: {
    paddingTop: space.s2,
    marginBottom: space.s4,
  },
  quickRowPressed: {
    opacity: 0.7,
  },
  quickContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickImage: {
    width: 69,
    height: 69,
  },
  quickText: {
    flex: 1,
    marginLeft: space.s2,
  },
  quickTitle: {
    ...type.text14,
    color: colors.fgBody,
  },
  quickSubtitle: {
    ...type.text12Alt,
    color: colors.fgBody,
    opacity: 0.4,
    marginTop: 2,
  },
  quickDivider: {
    height: 1,
    backgroundColor: colors.fgBody,
    opacity: 0.2,
    marginTop: space.s1,
  },
});

export default AddAppointmentScreen;
