import antfu from '@antfu/eslint-config'
import expo from 'eslint-plugin-expo'
import reactHooks from 'eslint-plugin-react-hooks'

const sourceFiles = ['**/*.{js,jsx,ts,tsx}']
const platformExtensions = [
  '.android.js',
  '.android.jsx',
  '.android.ts',
  '.android.tsx',
  '.ios.js',
  '.ios.jsx',
  '.ios.ts',
  '.ios.tsx',
  '.native.js',
  '.native.jsx',
  '.native.ts',
  '.native.tsx',
  '.web.js',
  '.web.jsx',
  '.web.ts',
  '.web.tsx',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
]

export default antfu(
  {
    type: 'app',
    ignores: [
      '.expo/**',
      'coverage/**',
      'dist/**',
      'assets/expo.icon/**',
    ],
    jsonc: true,
    react: false,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    yaml: true,
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'antfu/no-top-level-await': 'off',
      'antfu/top-level-function': 'off',
      'import/consistent-type-specifier-style': 'off',
      'jsonc/key-spacing': 'off',
      'jsonc/sort-keys': 'off',
      'no-ternary': 'error',
      'node/prefer-global/process': 'off',
      'perfectionist/sort-imports': 'off',
      'style/arrow-parens': 'off',
      'style/brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true,
        },
      ],
      'style/jsx-curly-newline': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/multiline-ternary': 'off',
      'style/operator-linebreak': 'off',
      'style/semi': [
        'error',
        'never',
      ],
      'ts/consistent-type-definitions': 'off',
      'ts/explicit-function-return-type': 'off',
      'ts/method-signature-style': 'off',
      'ts/no-use-before-define': 'off',
      'ts/prefer-literal-enum-member': 'off',
    },
  },
  {
    files: sourceFiles,
    plugins: {
      expo,
      'react-hooks': reactHooks,
    },
    settings: {
      'import/extensions': platformExtensions,
      'import/ignore': ['node_modules[\\\\/]+@?react-native'],
      'import/resolver': {
        node: {
          extensions: platformExtensions,
        },
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'expo/no-dynamic-env-var': 'warn',
      'expo/no-env-var-destructuring': 'warn',
      'expo/use-dom-exports': 'error',
    },
  },
)
