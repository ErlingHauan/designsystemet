/** @type {import("prettier").Config} */
export default {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  singleAttributePerLine: true,
  overrides: [{ files: '**/*.css', options: { printWidth: 160 } }],
};
