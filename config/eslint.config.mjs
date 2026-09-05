import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

/**
 * Lives in config/ with the other tool config, and is pointed at explicitly from the
 * lint script. ESLint covers what the other two checks can't see: `tsc` reasons about
 * types and the structure check reasons about directories, but neither knows a hook
 * from a function or an <img> from an accessible one.
 *
 * Type-aware rules are on. They need a TypeScript program, which is why .mjs files
 * below opt back out — they aren't in the program at all.
 */
const ROOT = fileURLToPath(new URL("..", import.meta.url));

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },

  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: ROOT },
    },
    rules: {
      // The codebase states intent with `undefined` checks rather than truthiness, and
      // exactOptionalPropertyTypes makes that distinction load-bearing.
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  {
    files: ["**/*.tsx"],
    extends: [jsxA11y.flatConfigs.recommended],
    // react-hooks still ships eslintrc-shaped configs, so the two rules are wired by
    // hand rather than through a preset that flat config would reject.
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      // Errors, not warnings: a warning that never fails the build is a warning nobody
      // reads. Where the rule is genuinely wrong, restructure rather than suppress.
      "react-hooks/exhaustive-deps": "error",
    },
  },

  {
    // The primitive layer forwards DOM capabilities; it doesn't decide to use them.
    // Whether autofocusing a given field is right is a question about the page that
    // renders it, and the rule still applies in full at every call site.
    files: ["src/ui/**/*.tsx"],
    rules: { "jsx-a11y/no-autofocus": "off" },
  },

  // Node scripts and tool config: not browser code, and .mjs is outside the TS program.
  {
    files: ["**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["config/**/*.ts"],
    languageOptions: { globals: globals.node },
  }
);
