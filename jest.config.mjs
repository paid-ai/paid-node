/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "(.+)\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/mock-server/setup.ts"],
  transformIgnorePatterns: [
    '/node_modules/(?!(until-async|msw|@mswjs|@bundled-es-modules|@open-draft|strict-event-emitter|outvariant|headers-polyfill)/)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    '^.+\\.(js|jsx)$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
