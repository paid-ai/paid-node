/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "(.+)\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/mock-server/setup.ts"],
  transformIgnorePatterns: [
    'node_modules/(?!(until-async|msw|@mswjs|@bundled-es-modules|@open-draft|@bundled-es-modules/statuses|strict-event-emitter)/)',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: './tests/tsconfig.json',
    }],
    '^.+\\.mjs$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        allowJs: true,
        types: ['jest', 'node'],
      },
    }],
    '^.+\\.jsx?$': ['babel-jest', {}],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
