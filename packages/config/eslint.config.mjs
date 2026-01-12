import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint Config (Flat Config Format for ESLint 9+)
 */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "build/**", "node_modules/**", ".turbo/**"],
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }]
    }
  }
];