import {
  AlertTriangle,
  X,
} from 'lucide-react-native'
import {
  BlurView,
} from 'expo-blur'
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native'

import {
  colors,
  resolveColorScheme,
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
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
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
        <BlurView
          intensity={42}
          pointerEvents="none"
          style={styles.backdropBlur}
          tint={scheme}
        />
        <Pressable
          accessibilityLabel="Закрыть подтверждение"
          style={[
            styles.backdrop,
            {
              backgroundColor: palette.backdrop,
            },
          ]}
          onPress={handleCancel}
        />
        <GlassPanel style={styles.dialog} variant="modal">
          <View style={styles.header}>
            <View
              style={[
                styles.iconFrame,
                {
                  backgroundColor: theme.dangerSoft,
                  borderColor: theme.danger,
                },
              ]}
            >
              <AlertTriangle color={theme.danger} size={20} strokeWidth={2.4} />
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
  backdropBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: spacing.four,
    padding: spacing.five,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.three,
    alignItems: 'flex-start',
  },
  iconFrame: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
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
