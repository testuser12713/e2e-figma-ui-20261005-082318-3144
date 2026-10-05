import React, { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DashboardStackParamList } from '../navigation/types';
import { colors, space, type } from '../theme';

export type DashboardMenuScreenProps = NativeStackScreenProps<
  DashboardStackParamList,
  'DashboardMenu'
>;

/** The drawer width measured in the frame (`[0,-114 294×1010]`). */
const DRAWER_WIDTH = 294;
/** The green profile header block (`[1,-1 294×208]`). */
const HEADER_HEIGHT = 208;

/**
 * The frame's close/back asset `icon-13x13.svg` (#23233C), inlined as SVG so it
 * renders on iOS, Android and web alike.
 */
function CloseIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 13.25 13.25">
      <Path
        d="M12.9178 0.333982C12.4723 -0.111327 11.75 -0.111327 11.3045 0.333982L6.62596 5.01257L1.94741 0.334233C1.50192 -0.111198 0.779645 -0.111327 0.334125 0.334233C-0.111385 0.779603 -0.111365 1.50177 0.334125 1.94751L5.01266 6.62604L0.334145 11.3046C-0.111345 11.7501 -0.111365 12.4723 0.334145 12.9179C0.779655 13.3635 1.50195 13.3635 1.94744 12.9179L6.62596 8.2392L11.3045 12.9179C11.75 13.3635 12.4723 13.3635 12.9178 12.9179C13.3633 12.4723 13.3633 11.7501 12.9178 11.3046L8.23925 6.62604L12.9178 1.94751C13.3633 1.50177 13.3633 0.779603 12.9178 0.333982Z"
        fill={colors.fg}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/**
 * The frame renders the Statistics icon empty, so DESIGN.md asks for a matching
 * outline drawn from the frame: a small bar chart in #23233C (19×18).
 */
function StatisticsIcon() {
  return (
    <Svg width={19} height={18} viewBox="0 0 19 18">
      <Rect x={1.5} y={8} width={3.6} height={8.5} rx={1} fill={colors.fg} />
      <Rect x={7.7} y={3.5} width={3.6} height={13} rx={1} fill={colors.fg} />
      <Rect x={13.9} y={11} width={3.6} height={5.5} rx={1} fill={colors.fg} />
    </Svg>
  );
}

/**
 * The frame renders the Logout icon empty, so DESIGN.md asks for a matching
 * outline drawn from the frame: an exit arrow in #23233C (20×18).
 */
function LogoutIcon() {
  return (
    <Svg width={20} height={18} viewBox="0 0 20 18">
      <Path
        d="M11.5 3H4.5A1.5 1.5 0 0 0 3 4.5v9A1.5 1.5 0 0 0 4.5 15h7"
        stroke={colors.fg}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M13 6.5 16.5 9.5 13 12.5"
        stroke={colors.fg}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 9.5H8"
        stroke={colors.fg}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

interface MenuEntryProps {
  testID: string;
  label: string;
  icon: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * One drawer entry. A disabled entry (no function this sprint) is rendered
 * visibly greyed out with a 'Coming soon' hint and never reacts to a press, so
 * no control silently does nothing (AC-08).
 */
function MenuEntry({ testID, label, icon, onPress, disabled }: MenuEntryProps) {
  const content = (
    <>
      <View style={styles.entryIcon}>{icon}</View>
      <Text style={styles.entryLabel} numberOfLines={1}>
        {label}
      </Text>
      {disabled ? (
        <Text style={styles.entryHint} testID={`${testID}-hint`}>
          Coming soon
        </Text>
      ) : null}
    </>
  );

  if (disabled) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        style={[styles.entry, styles.entryDisabled]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.entry,
        styles.entryEnabled,
        pressed ? styles.entryPressed : null,
      ]}
    >
      {content}
    </Pressable>
  );
}

/**
 * The Dashboard 'menu' state: the Dashboard dimmed under a 40% black backdrop
 * and a 294px white drawer holding the profile header and the entry list
 * (Statistics, Account Settings, Help, Logout). Statistics opens the
 * DashboardStats state; the other entries have no function this sprint and are
 * visibly disabled. The drawer's close icon and the backdrop both return to the
 * dashboard (AC-08, AC-09).
 */
export function DashboardMenuScreen({ navigation }: DashboardMenuScreenProps) {
  const insets = useSafeAreaInsets();
  const close = () => navigation.goBack();

  return (
    <View style={styles.root} testID="screen-dashboard-menu">
      <Pressable
        testID="dashboard-menu-backdrop"
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        onPress={close}
        style={styles.backdrop}
      />

      <View style={styles.drawer}>
        <View
          style={[styles.header, { paddingTop: insets.top }]}
          testID="dashboard-menu-profile"
        >
          <View style={styles.profileRow}>
            <View style={styles.profileIdentity}>
              <Image
                source={require('../../design/figma/assets/profile-image.png')}
                style={styles.avatar}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
              <View style={styles.profileText}>
                <Text style={styles.profileName} testID="dashboard-menu-profile-name">
                  Sophie Garnier
                </Text>
                <Text
                  style={styles.profileLocation}
                  testID="dashboard-menu-profile-location"
                >
                  Luxembourg
                </Text>
              </View>
            </View>

            <Pressable
              testID="dashboard-menu-close"
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={close}
              hitSlop={16}
              style={({ pressed }) => [
                styles.closeButton,
                pressed ? styles.entryPressed : null,
              ]}
            >
              <CloseIcon />
            </Pressable>
          </View>
        </View>

        <View
          style={[styles.body, { paddingBottom: insets.bottom + space.s5 }]}
        >
          <MenuEntry
            testID="menu-entry-statistics"
            label="Statistics"
            icon={<StatisticsIcon />}
            onPress={() => navigation.navigate('DashboardStats')}
          />
          <MenuEntry
            testID="menu-entry-account-settings"
            label="Account Settings"
            disabled
            icon={
              <Image
                source={require('../../design/figma/assets/noun-user-1335326-19x19.png')}
                style={styles.entryImage}
                resizeMode="contain"
              />
            }
          />
          <MenuEntry
            testID="menu-entry-help"
            label="Help"
            disabled
            icon={
              <Image
                source={require('../../design/figma/assets/noun-info-1174604-17x17.png')}
                style={styles.entryImageSmall}
                resizeMode="contain"
              />
            }
          />

          <View style={styles.spacer} />

          <MenuEntry
            testID="menu-entry-logout"
            label="Logout"
            disabled
            icon={<LogoutIcon />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.black,
    opacity: 0.4,
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    minHeight: HEADER_HEIGHT,
    backgroundColor: colors.accent,
  },
  profileRow: {
    marginTop: 60,
    paddingLeft: 23,
    paddingRight: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.s1,
    flexShrink: 1,
  },
  avatar: {
    width: 75,
    height: 75,
  },
  profileText: {
    flexShrink: 1,
  },
  profileName: {
    ...type.text16,
    color: colors.fg,
  },
  profileLocation: {
    ...type.text14Alt,
    color: colors.fg,
    marginTop: 5,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    paddingTop: 38,
    paddingHorizontal: space.s5,
  },
  entry: {
    minHeight: 44,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space.s1,
  },
  entryIcon: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryImage: {
    width: 19,
    height: 19,
  },
  entryImageSmall: {
    width: 17,
    height: 17,
  },
  entryLabel: {
    ...type.text14,
    color: colors.fg,
    flex: 1,
  },
  entryHint: {
    ...type.text10,
    color: colors.mutedAlt,
  },
  entryEnabled: {
    opacity: 0.6,
  },
  entryDisabled: {
    opacity: 0.4,
  },
  entryPressed: {
    opacity: 0.7,
  },
  spacer: {
    flex: 1,
  },
});

export default DashboardMenuScreen;
