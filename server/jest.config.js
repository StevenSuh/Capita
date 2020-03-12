module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ['node_modules/(?!(shared)/)'],
  testEnvironment: "node",
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
   },
};
