import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", //Virtuliza el DOM para pruebs
    globals: true, //Nos disponibiliza de manera global ciertos matches
    setupFiles: ["./src/setupTest.ts"], //Archivo de configuración de pruebas
    coverage: {
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.ts",
        "**/*.config.js",
        "**/*.d.ts",
        "**/types.ts",
        "**/.types.ts",
        "**/.App.tsx",
        "**/.main.tsx",
      ],
    },
  },
});
