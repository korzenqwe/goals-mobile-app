import {
  ChevronLeft,
} from 'lucide-react-native'
import {
  useRouter,
} from 'expo-router'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  spacing,
  typography,
  useAppTheme,
} from '@/shared/theme'
import {
  IconButton,
} from '@/shared/ui/icon-button'

type PageHeaderProps = {
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
}: PageHeaderProps) {
  const router = useRouter()
  const theme = useAppTheme()
  let backButton = null
  let subtitleContent = null

  if (showBackButton) {
    backButton = (
      <IconButton
        accessibilityLabel="Назад"
        icon={ChevronLeft}
        onPress={() => router.back()}
        variant="ghost"
      />
    )
  }

  if (subtitle) {
    subtitleContent = (
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    )
  }

  return (
    <View style={styles.header}>
      {backButton}
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitleContent}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.one,
  },
  title: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
})
