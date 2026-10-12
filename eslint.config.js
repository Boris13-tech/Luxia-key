import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.pnpm-store-local/**', 'coverage/**'] },
  { files: ['**/*.ts', '**/*.tsx'], languageOptions: { parser: tseslint.parser }, rules: {
    'no-debugger': 'error', 'no-eval': 'error', 'no-implied-eval': 'error',
  } },
  ...tseslint.configs.recommended.map(c => ({ ...c, files: ['services/**/*.ts', 'packages/**/*.ts', 'apps/web/**/*.ts', 'tests/**/*.ts'] })),
  { files: ['src/**/*.{ts,tsx}', 'apps/web/**/*.ts', 'packages/sdk-js/**/*.ts'], rules: {
    'no-restricted-imports': ['error', { patterns: ['**/server/**', '**/services/**', '@simplewebauthn/server', 'node:*', 'pg'] }],
  } },
);
