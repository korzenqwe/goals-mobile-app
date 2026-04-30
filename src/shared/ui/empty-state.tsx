import type { ComponentType } from 'react';
import { StyleSheet, Text } from 'react-native';

import { spacing, typography, useAppTheme } from '@/shared/theme';
import { GlassPanel } from '@/shared/ui/glass-panel';
import { IconButton } from '@/shared/ui/icon-button';

type EmptyStateProps = {
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <GlassPanel style={styles.panel}>
      <Icon color={theme.accent} size={32} strokeWidth={2.4} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
      {actionLabel && onActionPress ? (
        <IconButton icon={Icon} label={actionLabel} onPress={onActionPress} />
      ) : null}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    gap: spacing.three,
    paddingVertical: spacing.six,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    textAlign: 'center',
  },
});
