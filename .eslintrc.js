module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "brace-style": [
      "error",
      "stroustrup"
    ],
    "comma-dangle": [
        "error",
        "never"
    ],
    "no-unused-vars": [
        "warn"
    ],
    "no-var": [
        "off"
    ],
    "one-var": [
        "off"
    ]
  }
}
