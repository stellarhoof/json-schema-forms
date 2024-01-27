module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["simple-import-sort"],
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "packages/*/dist",
    "!packages/chakra-mobx/src/.storybook",
  ],
}
