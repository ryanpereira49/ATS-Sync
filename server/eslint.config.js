import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vitestPlugin from "eslint-plugin-vitest";
import drizzle from "eslint-plugin-drizzle";

export default defineConfig(
  {
    // Ignore all generated JavaScript files
    ignores: ["**/*.js"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,

      "@typescript-eslint/unbound-method": "off",
    },
  },

  {
    plugins: {
      drizzle,
    },
    rules: {
      ...drizzle.configs.recommended.rules,
    },
  },
);
