module.exports = {
  env: {
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-native'],
  ignorePatterns: ['dist/*'],
  rules: {
    semi: ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'react/display-name': 'off',
    'prefer-const': 'error',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    curly: [2, 'all'],
  },
}
