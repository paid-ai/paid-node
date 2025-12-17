/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    setupFilesAfterEnv: ["<rootDir>/tests/mock-server/setup.ts"],
    transformIgnorePatterns: [
        "node_modules/(?!(until-async)/)",
    ],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
        "^.+\\.m?jsx?$": ["ts-jest", { isolatedModules: true }],
    },
};
