import importPlugin from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser';

// Narrowly scoped to import ordering only — oxlint remains the primary linter.
// Uses @babel/eslint-parser (not typescript-eslint) because the latter does not
// yet support TypeScript 7.
export default [
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                sourceType: 'module',
                babelOptions: {
                    presets: [['@babel/preset-typescript', { allExtensions: true, isTSX: true }]],
                },
            },
        },
        plugins: { import: importPlugin },
        rules: {
            'import/order': [
                'error',
                {
                    // Packages first (builtin/external), local relative imports last.
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                },
            ],
        },
    },
];
