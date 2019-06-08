module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  coverageReporters: ['html', 'json', 'text'],
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node',
  ],
};
