import { includeIgnoreFile } from 'eslint/config'
import path from 'path'
import { fileURLToPath } from 'url'
import cfg from '@fingerprintjs/eslint-config-dx-team/type-checked'
import react from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * @type {import('eslint').Linter.Config[]}
 * */
const config = [
  includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
  {
    ignores: ['**/build/**', '**/dist/**', '**/node_modules/**', '**/ios/**', '**/android/**', '**/.tsup/**'],
  },
  ...cfg,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-type-checked'],
    rules: {
      ...react.configs['recommended-type-checked'].rules,
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/no-use-context': 'off',
    },
  },
  reactHooks.configs.flat['recommended-latest'],

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    ignores: ['sdk/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['sdk/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: 'sdk/tsconfig.tests.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Relax eslint rules in test/example projects
    files: ['{TestProject,e2e-app}/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
]

export default config
