import {
  AlertTriangle,
  X,
} from 'lucide-react-native'
import {
  BlurView,
} from 'expo-blur'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  type ViewStyle,
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

  const dialog = (
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
  )

  if (Platform.OS === 'web') {
    let pointerEvents: 'auto' | 'none' = 'none'
    let opacity = 0

    if (visible) {
      pointerEvents = 'auto'
      opacity = 1
    }

    return (
      <View
        accessibilityViewIsModal={visible}
        pointerEvents={pointerEvents}
        style={[
          styles.overlay,
          webOverlayStyle,
          {
            opacity,
          },
        ]}
      >
        <BackdropBlur tint={scheme} />
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
        {dialog}
      </View>
    )
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
        <BackdropBlur tint={scheme} />
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
        {dialog}
      </View>
    </Modal>
  )
}

type BackdropBlurProps = {
  tint: 'dark' | 'light'
}

type WebBackdropStyle = ViewStyle & {
  WebkitBackdropFilter?: string
  backdropFilter?: string
}

type WebOverlayStyle = ViewStyle & {
  position: 'fixed'
}

const webBackdropBlurStyle: WebBackdropStyle = {
  backdropFilter: 'blur(22px) saturate(170%)',
  WebkitBackdropFilter: 'blur(22px) saturate(170%)',
}

const webOverlayStyle: WebOverlayStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
}

function BackdropBlur({
  tint,
}: BackdropBlurProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.backdropBlur,
          webBackdropBlurStyle,
        ]}
      />
    )
  }

  return (
    <BlurView
      intensity={46}
      pointerEvents="none"
      style={styles.backdropBlur}
      tint={tint}
    />
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
