import {
  Check,
} from 'lucide-react-native'
import {
  useState,
} from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import {
  spacing,
  typography,
  useAppTheme,
} from '@/shared/theme'
import {
  GlassPanel,
  IconButton,
} from '@/shared/ui'

export type GoalFormValues = {
  title: string
  description: string | null
}

type GoalFormProps = {
  autoFocusTitle?: boolean
  error?: string | null
  initialValues?: Partial<GoalFormValues>
  isSubmitting?: boolean
  onSubmit: (values: GoalFormValues) => Promise<void> | void
  submitLabel: string
}

export function GoalForm({
  autoFocusTitle = false,
  error,
  initialValues,
  isSubmitting = false,
  onSubmit,
  submitLabel,
}: GoalFormProps) {
  const theme = useAppTheme()
  const [
    title,
    setTitle,
  ] = useState(initialValues?.title ?? '')
  const [
    description,
    setDescription,
  ] = useState(initialValues?.description ?? '')
  const canSubmit = title.trim().length > 0 && !isSubmitting
  let errorContent = null
  let submitButtonLabel = submitLabel

  if (error) {
    errorContent = <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
  }

  if (isSubmitting) {
    submitButtonLabel = 'Сохраняем...'
  }

  return (
    <GlassPanel style={styles.panel}>
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Название</Text>
        <TextInput
          autoFocus={autoFocusTitle}
          maxLength={80}
          onChangeText={setTitle}
          placeholder="Например, читать каждый день"
          placeholderTextColor={theme.textSecondary}
          returnKeyType="done"
          style={[
            styles.input,
            {
              backgroundColor: theme.glassChrome,
              borderColor: theme.glassBorder,
              color: theme.text,
            },
          ]}
          value={title}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Описание</Text>
        <TextInput
          maxLength={240}
          multiline
          onChangeText={setDescription}
          placeholder="Необязательно"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: theme.glassChrome,
              borderColor: theme.glassBorder,
              color: theme.text,
            },
          ]}
          textAlignVertical="top"
          value={description ?? ''}
        />
      </View>

      {errorContent}

      <IconButton
        accessibilityLabel={submitLabel}
        disabled={!canSubmit}
        icon={Check}
        label={submitButtonLabel}
        onPress={() => {
          void onSubmit({
            title: title.trim(),
            description: description.trim() || null,
          })
        }}
      />
    </GlassPanel>
  )
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.four,
  },
  field: {
    gap: spacing.two,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.three,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  textArea: {
    minHeight: 104,
  },
  error: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
})
