import {
  CircleAlert,
  CircleCheck,
} from 'lucide-react-native'
import type {
  PropsWithChildren,
} from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import {
  spacing,
  typography,
  useAppTheme,
} from '@/shared/theme'
import {
  GlassPanel,
} from '@/shared/ui/glass-panel'

type ToastVariant = 'error' | 'success'

type ToastInput = {
  message: string
  variant?: ToastVariant
}

type ToastMessage = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  showToast: (input: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({
  children,
}: PropsWithChildren) {
  const insets = useSafeAreaInsets()
  const theme = useAppTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastIdRef = useRef(0)
  const translateY = useRef(new Animated.Value(-12)).current
  const [
    toast,
    setToast,
  ] = useState<ToastMessage | null>(null)

  const clearDismissTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const hideToast = useCallback((toastId: number) => {
    clearDismissTimer()

    Animated.parallel([
      Animated.timing(opacity, {
        duration: 170,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 170,
        toValue: -12,
        useNativeDriver: true,
      }),
    ]).start((result) => {
      if (!result.finished) {
        return
      }

      if (toastIdRef.current === toastId) {
        setToast(null)
      }
    })
  }, [
    clearDismissTimer,
    opacity,
    translateY,
  ])

  const showToast = useCallback((input: ToastInput) => {
    clearDismissTimer()
    opacity.stopAnimation()
    translateY.stopAnimation()

    let variant: ToastVariant = 'success'

    if (input.variant) {
      variant = input.variant
    }

    const nextToastId = toastIdRef.current + 1
    toastIdRef.current = nextToastId

    setToast({
      id: nextToastId,
      message: input.message,
      variant,
    })

    Animated.parallel([
      Animated.spring(opacity, {
        damping: 18,
        mass: 0.8,
        stiffness: 220,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        damping: 18,
        mass: 0.8,
        stiffness: 220,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start()

    timerRef.current = setTimeout(hideToast, toastVisibilityDuration, nextToastId)
  }, [
    clearDismissTimer,
    hideToast,
    opacity,
    translateY,
  ])

  useEffect(() => clearDismissTimer, [
    clearDismissTimer,
  ])

  const contextValue = useMemo(() => ({
    showToast,
  }), [
    showToast,
  ])
  let accentColor: string = theme.accent
  let iconBackgroundColor: string = theme.accentSoft
  let icon = <CircleCheck color={accentColor} size={20} strokeWidth={2.5} />
  let message = ''

  if (toast) {
    message = toast.message

    if (toast.variant === 'error') {
      accentColor = theme.danger
      iconBackgroundColor = theme.dangerSoft
      icon = <CircleAlert color={accentColor} size={20} strokeWidth={2.5} />
    }
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View
        pointerEvents="none"
        style={[
          styles.viewport,
          {
            top: insets.top + spacing.three,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.toastShell,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <GlassPanel shape="capsule" style={styles.toast} variant="toast">
            <View style={[styles.iconFrame, { backgroundColor: iconBackgroundColor }]}>
              {icon}
            </View>
            <Text numberOfLines={2} style={[styles.message, { color: theme.text }]}>
              {message}
            </Text>
          </GlassPanel>
        </Animated.View>
      </View>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.')
  }

  return context
}

const toastVisibilityDuration = 2600

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.four,
    zIndex: 1100,
  },
  toastShell: {
    width: '100%',
    maxWidth: 420,
  },
  toast: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.three,
    paddingVertical: spacing.three,
  },
  iconFrame: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  message: {
    flex: 1,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: '700',
  },
})
