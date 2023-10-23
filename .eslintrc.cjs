/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:perfectionist/recommended-natural",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: { attributes: false },
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

module.exports = config;
