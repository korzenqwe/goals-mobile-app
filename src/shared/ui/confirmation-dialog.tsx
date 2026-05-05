import {
  AlertTriangle,
  X,
} from 'lucide-react-native'
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
  BottomSheet,
} from '@/shared/ui/bottom-sheet'
import {
  IconButton,
} from '@/shared/ui/icon-button'

type ConfirmationDialogProps = {
  cancelLabel?: string
  confirmLabel: string
  isConfirming?: boolean
  message: string
  onCancel: () => void
  onConfirm: () => void
  title: string
  visible: boolean
}

export function ConfirmationDialog({
  cancelLabel = 'Отмена',
  confirmLabel,
  isConfirming = false,
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: ConfirmationDialogProps) {
  const theme = useAppTheme()
  let confirmButtonLabel = confirmLabel

  if (isConfirming) {
    confirmButtonLabel = 'Удаляем...'
  }

  return (
    <BottomSheet
      dismissDisabled={isConfirming}
      onDismiss={onCancel}
      visible={visible}
    >
      <View style={styles.hero}>
        <View
          style={[
            styles.iconHalo,
            {
              backgroundColor: theme.dangerSoft,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <View
            style={[
              styles.iconFrame,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.danger,
              },
            ]}
          >
            <AlertTriangle color={theme.danger} size={24} strokeWidth={2.3} />
          </View>
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <View style={[styles.noticeMark, { backgroundColor: theme.danger }]} />
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          Действие нельзя отменить
        </Text>
      </View>

      <View style={styles.actions}>
        <IconButton
          disabled={isConfirming}
          icon={X}
          label={cancelLabel}
          onPress={onCancel}
          style={styles.actionButton}
          variant="soft"
        />
        <IconButton
          disabled={isConfirming}
          icon={AlertTriangle}
          label={confirmButtonLabel}
          onPress={onConfirm}
          style={styles.actionButton}
          variant="danger"
        />
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.three,
  },
  iconHalo: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 36,
  },
  iconFrame: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.two,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.subtitle.lineHeight,
    fontWeight: typography.subtitle.fontWeight,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    textAlign: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.two,
    paddingHorizontal: spacing.two,
  },
  noticeMark: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  noticeText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  actionButton: {
    flex: 1,
  },
})
