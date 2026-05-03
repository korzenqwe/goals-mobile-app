import { Pressable, StyleSheet, Text, View } from 'react-native'

import { radii, spacing, typography, useAppTheme } from '@/shared/theme'

type SegmentedControlItem<TValue extends string> = {
  label: string
  value: TValue
}

type SegmentedControlProps<TValue extends string> = {
  items: readonly SegmentedControlItem<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SegmentedControl<TValue extends string>({
  items,
  value,
  onValueChange,
}: SegmentedControlProps<TValue>) {
  const theme = useAppTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {items.map((item) => {
        const isSelected = item.value === value
        let labelColor: string = theme.textSecondary

        if (isSelected) {
          labelColor = '#FFFFFF'
        }

        return (
          <Pressable
            accessibilityRole="button"
            key={item.value}
            onPress={() => onValueChange(item.value)}
            style={[styles.item, isSelected && { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.label, { color: labelColor }]}>
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.one,
    borderRadius: radii.full,
    padding: spacing.one,
  },
  item: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    paddingHorizontal: spacing.two,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
})
