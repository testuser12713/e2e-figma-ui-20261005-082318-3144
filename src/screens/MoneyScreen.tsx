import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MoneyStackParamList, RootTabParamList } from '../navigation/types';
import { useAppData } from '../state/AppData';
import { Transaction } from '../data/types';
import Row from '../components/Row';
import Card from '../components/Card';
import FloatingAddButton from '../components/FloatingAddButton';
import {
  colors,
  formatAmount,
  radius,
  screenInset,
  space,
  TAB_BAR_HEIGHT,
  type,
} from '../theme';

export type MoneyScreenProps = NativeStackScreenProps<
  MoneyStackParamList,
  'MoneyList'
>;

const TILE_SIZE = 55;
const HEADER_HEIGHT = 406;

/* DESIGN.md "Header with back chevron": the glyph is 11×18 in #181461, drawn
 * like the Time screen's control so the same asset reads identical on both. */
function BackChevron() {
  return (
    <Svg width={11} height={18} viewBox="0 0 10.77 18.2">
      <Path
        d="M10.3385 15.8922L3.28952 9.09957L10.3385 2.30693C10.5948 2.0506 10.7443 1.7302 10.7443 1.36707C10.7443 1.00394 10.6162 0.66217 10.3598 0.40585C10.1035 0.14952 9.78312 0 9.41998 0L9.39863 0C9.05686 0 8.71509 0.12816 8.45876 0.38449L0.40585 8.13835C0.14953 8.39468 0 8.73645 0 9.09957C0 9.4627 0.14953 9.82583 0.40585 10.0608L8.48013 17.8147C8.73645 18.0496 9.05686 18.1992 9.41999 18.1992C9.78312 18.1992 10.1249 18.0496 10.3812 17.7933C10.6375 17.537 10.7657 17.1952 10.7657 16.8321C10.7657 16.469 10.6162 16.1272 10.3385 15.8922Z"
        fill={colors.iconInk}
        fillRule="evenodd"
      />
    </Svg>
  );
}

/* Category-tile icons. The frame's own assets are empty, so DESIGN.md asks for
 * a matching outline drawn in #000000 — kept as plain react-native-svg shapes
 * so the same code renders on iOS, Android and the web build. */
function HomeIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Path
        d="M12 3 2.5 11h2.6v9.5h5.1V15h3.6v5.5h5.1V11h2.6L12 3Z"
        fill={colors.black}
      />
    </Svg>
  );
}

function BriefcaseIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24">
      <Rect x={2} y={7.5} width={20} height={12.5} rx={2} fill={colors.black} />
      <Rect x={8} y={4} width={8} height={4} rx={1} fill={colors.black} />
    </Svg>
  );
}

function DishIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24">
      <Path
        d="M7 3v6M5 3v6M9 3v6M7 9v12"
        stroke={colors.black}
        strokeWidth={1.7}
        fill="none"
      />
      <Path
        d="M16 3c-1.6 0-2.6 1.9-2.6 4.6S14.4 12 16 12v9"
        stroke={colors.black}
        strokeWidth={1.7}
        fill="none"
      />
    </Svg>
  );
}

function FriendsIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24">
      <Circle cx={9} cy={8} r={3.4} fill={colors.black} />
      <Path d="M2.8 20c0-3.5 2.8-6.2 6.2-6.2s6.2 2.7 6.2 6.2Z" fill={colors.black} />
      <Circle cx={17.2} cy={9} r={2.6} fill={colors.black} />
      <Path
        d="M15 19.8c0-2.8 1.5-5 4-5.4"
        stroke={colors.black}
        strokeWidth={1.7}
        fill="none"
      />
    </Svg>
  );
}

function BagIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Path d="M4 8h16l-1.3 12.2H5.3L4 8Z" fill={colors.black} />
      <Path
        d="M8.5 8V6.4a3.5 3.5 0 0 1 7 0V8"
        stroke={colors.black}
        strokeWidth={1.7}
        fill="none"
      />
    </Svg>
  );
}

function GasIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Rect x={4} y={4} width={10} height={17} rx={1.5} fill={colors.black} />
      <Rect x={6.5} y={7} width={5} height={5} fill={colors.surface} />
      <Path
        d="M14 8.5h2.6v8.7a1.9 1.9 0 0 0 3.8 0V9.6L18.2 7.4"
        stroke={colors.black}
        strokeWidth={1.7}
        fill="none"
      />
    </Svg>
  );
}

const CATEGORY_TILES: Array<{ key: string; Icon: () => React.JSX.Element }> = [
  { key: 'home', Icon: HomeIcon },
  { key: 'briefcase', Icon: BriefcaseIcon },
  { key: 'dish', Icon: DishIcon },
  { key: 'friends', Icon: FriendsIcon },
  { key: 'bag', Icon: BagIcon },
  { key: 'gas', Icon: GasIcon },
];

function MoneyHeader({
  expenses,
  onOpenReport,
  onBack,
}: {
  expenses: number;
  onOpenReport: () => void;
  onBack: () => void;
}) {
  return (
    <View>
      <Pressable
        testID="money-header-card"
        accessibilityRole="button"
        accessibilityLabel="Monthly expenses"
        onPress={onOpenReport}
        style={styles.headerCard}
      >
        <Image
          source={require('../../design/figma/assets/illustration-525x387.png')}
          style={styles.headerIllustration}
          resizeMode="cover"
        />
        <Pressable
          testID="money-back-button"
          accessibilityRole="button"
          accessibilityLabel="Back to Dashboard"
          onPress={(event) => {
            /* The chevron sits inside the header card, which opens the report;
             * keep its own press from also triggering the card's. */
            event.stopPropagation();
            onBack();
          }}
          style={styles.backButton}
        >
          <BackChevron />
        </Pressable>
        <View style={styles.avatar} testID="money-avatar">
          <Text style={styles.avatarLetter}>R</Text>
        </View>
        <View style={styles.amountBlock}>
          <Text style={styles.eyebrow}>Monthly Expenses</Text>
          <Text style={styles.heroAmount} testID="money-expenses-total">
            {formatAmount(expenses)}
          </Text>
        </View>
      </Pressable>

      <Card style={styles.quickCard} testID="money-quick-categories">
        <Text style={styles.quickTitle}>Quick Categories</Text>
        <View style={styles.quickGrid}>
          {CATEGORY_TILES.map(({ key, Icon }) => (
            <View
              key={key}
              testID={`quick-category-${key}`}
              accessibilityState={{ disabled: true }}
              style={styles.tile}
            >
              <Icon />
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function TransactionRow({
  item,
  onPress,
}: {
  item: Transaction;
  onPress: () => void;
}) {
  return (
    <Row
      testID={`transaction-row-${item.id}`}
      meta={item.category}
      title={item.title}
      subtitle={item.date}
      amount={item.amount}
      kind={item.kind}
      onPress={onPress}
      style={styles.txnRow}
    />
  );
}

/**
 * Money Management list: the monthly-expenses header block, the Quick
 * Categories panel and the scrollable transaction list (AC-04). The header and
 * every transaction row open the weekly report; the FAB opens the add sheet.
 */
export function MoneyScreen({ navigation }: MoneyScreenProps) {
  const { transactions, totals } = useAppData();
  const openReport = () => navigation.navigate('MoneyReport');
  /* The chevron is a live control: it leaves the Money stack through the parent
   * tab navigator and lands on the Dashboard tab (DESIGN.md "Header with back
   * chevron" — the frame shows it as an active control, not a disabled one). */
  const goToDashboard = () =>
    navigation
      .getParent<BottomTabNavigationProp<RootTabParamList>>()
      ?.navigate('Dashboard');

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="screen-money-list">
      <FlatList
        style={styles.list}
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <MoneyHeader
            expenses={totals.expenses}
            onOpenReport={openReport}
            onBack={goToDashboard}
          />
        }
        renderItem={({ item }) => (
          <TransactionRow item={item} onPress={openReport} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.fabWrap} pointerEvents="box-none">
        <FloatingAddButton
          testID="money-add-button"
          label="Add expense"
          onPress={() => navigation.navigate('AddExpense')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgAlt },
  list: { flex: 1 },
  /* DESIGN.md uses a 118px bottom content inset on scrollable lists so the last
   * row clears the FAB and the tab bar (TAB_BAR_HEIGHT = 118). */
  listContent: { paddingBottom: TAB_BAR_HEIGHT },
  headerCard: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.surface,
    justifyContent: 'flex-end',
    paddingLeft: 49,
    paddingRight: screenInset,
    paddingBottom: 51,
    overflow: 'hidden',
  },
  headerIllustration: {
    position: 'absolute',
    top: -74,
    left: -73,
    width: 525,
    height: 387,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    position: 'absolute',
    top: 77,
    left: 296,
    width: 51,
    height: 51,
    borderRadius: 51 / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...type.text20,
    fontSize: 32,
    lineHeight: 41,
    color: colors.fgInverse,
  },
  amountBlock: {
    alignSelf: 'flex-start',
  },
  eyebrow: {
    ...type.text12,
    color: colors.black,
  },
  heroAmount: {
    ...type.amountHero,
    color: colors.black,
    textTransform: 'uppercase',
  },
  quickCard: {
    marginTop: 47,
    marginHorizontal: screenInset,
    paddingTop: 34,
    paddingBottom: 52,
    paddingLeft: 24,
    paddingRight: 24,
  },
  quickTitle: {
    ...type.text12,
    color: colors.black,
    textAlign: 'center',
  },
  quickGrid: {
    marginTop: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 51,
    rowGap: 37,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.black,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnRow: {
    paddingHorizontal: 28,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: space.s5,
    alignItems: 'center',
  },
});

export default MoneyScreen;
