module.exports = {
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-airbnb-with-typescript",
    "@vue/eslint-config-airbnb-with-typescript/allow-js-in-vue",
  ],
  plugins: [
    "unused-imports",
  ],
  rules: {
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "camelcase": 0,
    "comma-dangle": ["error", "always-multiline"],
    "no-restricted-syntax": 0, // we don't invest in IE11 testing
    "no-use-before-define": 0, // stick to the original Java scope parsing style instead of "new" js
    "@typescript-eslint/no-use-before-define": 0, // stick to the original Java scope parsing style instead of "new" js
    "import/no-cycle": ["error"], // a good one, but broken linter
    "import/no-extraneous-dependencies": 0, // not applicable
    "no-empty-function": 0, // a good one, but broken linter
    "no-useless-constructor": 0, // a good one, but broken linter
    "no-console": 0, // not applicable
    "consistent-return": 0, // a good one, but broken linter
    "object-shorthand": 0, // shorthand works poorly with pycharm
    "object-curly-newline": 0, // a good one, but broken linter
    "no-unused-vars": 0, // a good one, but many exceptions + broken linter
    "no-underscore-dangle": 0, // not applicable
    "prefer-destructuring": 0, // poor code style
    "no-inner-declarations": 0,
    "import/prefer-default-export": 0,
    "import/extensions": 0,
    "@typescript-eslint/quotes": 0, // disable single quotes enforcement
    "@typescript-eslint/indent": 0, // incompatible with indents in .vue <script setup>
    "unused-imports/no-unused-imports": ["error"],
    "vue/multi-word-component-names": 0,
    "vue/script-indent": [
      "error",
      2,
      { "baseIndent": 1 },
    ],
  },
};
