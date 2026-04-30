import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useAppTheme } from '@/shared/theme';
import { IconButton } from '@/shared/ui/icon-button';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
};

export function PageHeader({ title, subtitle, showBackButton = false }: PageHeaderProps) {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <IconButton
          accessibilityLabel="Назад"
          icon={ChevronLeft}
          onPress={() => router.back()}
          variant="ghost"
        />
      ) : null}
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
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
});
