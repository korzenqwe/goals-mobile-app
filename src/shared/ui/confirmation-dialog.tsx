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
      <View style={styles.handleTrack}>
        <View style={[styles.handle, { backgroundColor: theme.glassEdge }]} />
      </View>

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
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>Действие нельзя отменить</Text>
      </View>

      <View style={styles.actions}>
        <IconButton
          disabled={isConfirming}
          icon={X}
          label={cancelLabel}
          onPress={handleCancel}
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
  backdropFilter: 'blur(10px) saturate(135%)',
  WebkitBackdropFilter: 'blur(10px) saturate(135%)',
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
      intensity={24}
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
  handleTrack: {
    alignItems: 'center',
    marginTop: -spacing.two,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    opacity: 0.64,
  },
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
