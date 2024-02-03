const stylistic = require("@stylistic/eslint-plugin");

module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: "latest",
		sourceType: "module",
		warnOnUnsupportedTypeScriptVersion: false
	},
	overrides: [
		{
			env: { node: true,},
			files: ['.eslintrc.cjs', 'postcss.config.js', 'tailwind.config.js'],
			parserOptions: { sourceType: 'script' }
		},
		{
			files: '*.ts?(x)',
			rules: { 'no-undef': 'off' }
		}
	],
	plugins: [
		'@stylistic',
		'@typescript-eslint',
		'react'
	],
	reportUnusedDisableDirectives: true,
	rules: {
		'no-unused-vars': 'off',
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
