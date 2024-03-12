import { type Config } from 'jest';

const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)?$';
const configs: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex,
  verbose: true,
  notify: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default configs;
