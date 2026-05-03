import type { PropsWithChildren, ReactNode } from 'react'
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors, resolveColorScheme, spacing } from '@/shared/theme'

type AppScreenProps = PropsWithChildren<{
  footer?: ReactNode
  scroll?: boolean
}>

export function AppScreen({ children, footer, scroll = false }: AppScreenProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const backgroundColor = colors[scheme].background

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.container}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {children}
          </ScrollView>
          {footer}
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
        {footer}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.five,
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.seven + spacing.six,
  },
  scrollContent: {
    gap: spacing.five,
    paddingHorizontal: spacing.four,
    paddingTop: spacing.four,
    paddingBottom: spacing.seven + spacing.six,
  },
})
