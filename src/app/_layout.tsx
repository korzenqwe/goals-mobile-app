import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler'

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import {
  Stack,
} from 'expo-router'
import {
  StatusBar,
} from 'expo-status-bar'
import {
  StyleSheet,
  useColorScheme,
} from 'react-native'

import {
  ToastProvider,
} from '@/shared/ui/toast'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  let navigationTheme = DefaultTheme

  if (colorScheme === 'dark') {
    navigationTheme = DarkTheme
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={navigationTheme}>
        <ToastProvider>
          <Stack
            screenOptions={{
              animation: 'slide_from_right',
              animationMatchesGesture: true,
              contentStyle: styles.stackContent,
              fullScreenGestureEnabled: true,
              gestureDirection: 'horizontal',
              gestureEnabled: true,
              headerShown: false,
            }}
          />
          <StatusBar style="auto" />
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stackContent: {
    backgroundColor: 'transparent',
  },
})
