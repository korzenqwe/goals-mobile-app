import { StyleSheet, Text } from 'react-native';

import { spacing, typography, useAppTheme } from '@/shared/theme';
import { GlassPanel } from '@/shared/ui';

type GoalFormPlaceholderProps = {
  mode: 'create' | 'edit';
};

export function GoalFormPlaceholder({ mode }: GoalFormPlaceholderProps) {
  const theme = useAppTheme();

  return (
    <GlassPanel style={styles.panel}>
      <Text style={[styles.title, { color: theme.text }]}>
        {mode === 'create' ? 'Новая цель' : 'Редактирование цели'}
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Название, описание и действия цели появятся здесь.
      </Text>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.two,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
  },
  text: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
