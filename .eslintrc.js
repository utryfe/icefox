const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: false,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': isProduction ? 1 : 0,
    'no-debugger': isProduction ? 2 : 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
