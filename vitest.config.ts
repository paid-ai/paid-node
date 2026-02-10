import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    globals: true,
                    name: "unit",
                    environment: "node",
                    root: "./tests",
                    include: ["**/*.test.{js,ts,jsx,tsx}"],
                    exclude: ["wire/**", "tracing/**"],
                },
            },
            {
                test: {
                    globals: true,
                    name: "wire",
                    environment: "node",
                    root: "./tests/wire",
                    setupFiles: ["../mock-server/setup.ts"],
                },
            },
            {
                test: {
                    globals: true,
                    name: "tracing",
                    environment: "node",
                    root: "./tests/tracing",
                    include: ["**/*.test.{js,ts,jsx,tsx}"],
                    setupFiles: ["../mock-server/setup.ts"],
                },
            },
        ],
        passWithNoTests: true,
    },
});
