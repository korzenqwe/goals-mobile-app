import {
  AlertTriangle,
  X,
} from 'lucide-react-native'
import {
  Modal,
  Pressable,
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
  GlassPanel,
} from '@/shared/ui/glass-panel'
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

  function handleCancel() {
    if (!isConfirming) {
      onCancel()
    }
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={handleCancel}
      transparent
      visible={visible}
      statusBarTranslucent
    >
      <View accessibilityViewIsModal style={styles.overlay}>
        <Pressable
          accessibilityLabel="Закрыть подтверждение"
          style={styles.backdrop}
          onPress={handleCancel}
        />
        <GlassPanel style={styles.dialog}>
          <View style={styles.header}>
            <View style={[styles.iconFrame, { backgroundColor: theme.danger }]}>
              <AlertTriangle color="#FFFFFF" size={20} strokeWidth={2.4} />
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
              <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              disabled={isConfirming}
              icon={X}
              label={cancelLabel}
              onPress={handleCancel}
              variant="ghost"
            />
            <IconButton
              disabled={isConfirming}
              icon={AlertTriangle}
              label={confirmButtonLabel}
              onPress={onConfirm}
              variant="danger"
            />
          </View>
        </GlassPanel>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.four,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  dialog: {
    gap: spacing.four,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.three,
  },
  iconFrame: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  copy: {
    flex: 1,
    gap: spacing.one,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
  },
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.two,
  },
})
