module.exports = {
  roots: [
    '<rootDir>',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/test/src/.*|(\\.|/)(test|spec))\\.ts$',
  coverageReporters: ['html', 'json', 'text'],
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node',
  ],
};
