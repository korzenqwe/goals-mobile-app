import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Цели</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Initial Expo SDK 55 project is ready for feature branches.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const lightColors = {
  background: '#F8FAFC',
  text: '#101828',
  secondaryText: '#475467',
};

const darkColors = {
  background: '#0B1220',
  text: '#F8FAFC',
  secondaryText: '#CBD5E1',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
});
