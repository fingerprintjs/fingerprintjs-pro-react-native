module.exports = {
  preset: 'react-native',
  testRegex: '/__tests__/.+test.tsx?$',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['./src/**/**.{ts,tsx}'],
  coverageReporters: ['lcov', 'json-summary', ['text', { file: 'coverage.txt', path: './' }]],
}
