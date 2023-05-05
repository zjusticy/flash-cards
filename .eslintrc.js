// .eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    sourceType: "module",
    project: "./tsconfig.json",
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended",
    // "plugin:jsx-a11y/recommended",

    // Prettier plugin and recommended rules
    // "prettier/@typescript-eslint",
    "prettier",
    // auto fix using prettier
    // "plugin:prettier/recommended",
  ],
  rules: {
    // Include .prettierrc.js rules
    // "prettier/prettier": ["error"],
    "no-param-reassign": [2, { props: false }],
    "object-curly-spacing": [2, "always"],

    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/require-default-props": 0,
  },
};
