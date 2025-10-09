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
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest', // Transform JS files with ts-jest
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
