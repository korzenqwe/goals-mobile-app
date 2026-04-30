import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, resolveColorScheme, spacing } from '@/shared/theme';

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
}>;

export function AppScreen({ children, scroll = false }: AppScreenProps) {
  const scheme = resolveColorScheme(useColorScheme());
  const backgroundColor = colors[scheme].background;

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.five,
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.seven,
  },
  scrollContent: {
    gap: spacing.five,
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.seven,
  },
});
