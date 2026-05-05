import {
  BlurView,
} from 'expo-blur'
import type {
  PropsWithChildren,
} from 'react'
import {
  useEffect,
} from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native'
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import {
  colors,
  resolveColorScheme,
  spacing,
  useAppTheme,
} from '@/shared/theme'
import {
  GlassPanel,
} from '@/shared/ui/glass-panel'

type BottomSheetProps = PropsWithChildren<{
  dismissDisabled?: boolean
  onDismiss: () => void
  visible: boolean
}>

type WebOverlayStyle = ViewStyle & {
  position: 'fixed'
}

export function BottomSheet({
  children,
  dismissDisabled = false,
  onDismiss,
  visible,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  const theme = useAppTheme()
  const sheetTranslateY = useSharedValue(0)
  let bottomInset = spacing.four

  if (insets.bottom > 0) {
    bottomInset = insets.bottom + spacing.two
  }

  function handleDismiss() {
    if (!dismissDisabled) {
      onDismiss()
    }
  }

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: sheetTranslateY.value,
      },
    ],
  }))
  const sheetGesture = Gesture.Pan()
    .enabled(visible && !dismissDisabled)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY
      }
    })
    .onEnd((event) => {
      let shouldDismiss = false

      if (event.translationY > sheetDismissThreshold) {
        shouldDismiss = true
      }

      if (event.velocityY > sheetDismissVelocity) {
        shouldDismiss = true
      }

      if (shouldDismiss) {
        sheetTranslateY.value = withTiming(sheetDismissDistance, {
          duration: 180,
        }, (finished) => {
          if (finished) {
            runOnJS(handleDismiss)()
          }
        })

        return
      }

      sheetTranslateY.value = withSpring(0, {
        damping: 24,
        stiffness: 260,
      })
    })

  useEffect(() => {
    if (visible) {
      sheetTranslateY.value = 0
    }
  }, [
    sheetTranslateY,
    visible,
  ])

  const sheet = (
    <GestureDetector gesture={sheetGesture}>
      <Animated.View style={[styles.sheetShell, animatedSheetStyle]}>
        <GlassPanel style={styles.sheet} variant="modal">
          <View style={styles.handleTrack}>
            <View style={[styles.handle, { backgroundColor: theme.glassEdge }]} />
          </View>
          {children}
        </GlassPanel>
      </Animated.View>
    </GestureDetector>
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
            paddingBottom: bottomInset,
          },
        ]}
      >
        <SheetBackdrop tint={scheme} />
        <Pressable
          accessibilityLabel="Закрыть окно"
          onPress={handleDismiss}
          style={[
            styles.backdrop,
            {
              backgroundColor: palette.backdrop,
            },
          ]}
        />
        {sheet}
      </View>
    )
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={handleDismiss}
      transparent
      visible={visible}
      statusBarTranslucent
    >
      <View
        accessibilityViewIsModal
        style={[
          styles.overlay,
          {
            paddingBottom: bottomInset,
          },
        ]}
      >
        <SheetBackdrop tint={scheme} />
        <Pressable
          accessibilityLabel="Закрыть окно"
          onPress={handleDismiss}
          style={[
            styles.backdrop,
            {
              backgroundColor: palette.backdrop,
            },
          ]}
        />
        {sheet}
      </View>
    </Modal>
  )
}

type SheetBackdropProps = {
  tint: 'dark' | 'light'
}

function SheetBackdrop({
  tint,
}: SheetBackdropProps) {
  return (
    <BlurView
      intensity={14}
      pointerEvents="none"
      style={styles.backdropBlur}
      tint={tint}
    />
  )
}

const sheetDismissDistance = 360
const sheetDismissThreshold = 96
const sheetDismissVelocity = 900

const webOverlayStyle: WebOverlayStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.three,
    paddingTop: spacing.four,
  },
  backdropBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetShell: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  sheet: {
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
})
