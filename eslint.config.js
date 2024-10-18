// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPrettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  eslintPrettierConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['build.config.ts', 'test.ts'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['eslint.config.js', 'node_modules/', 'dist/', 'build/'],
  },
);
