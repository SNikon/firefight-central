
module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:@stylistic/disable-legacy'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: { jsx: true },
		ecmaVersion: 'latest',
		sourceType: 'module',
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
		'@stylistic/ts',
		'@typescript-eslint',
		'import',
		'react'
	],
	reportUnusedDisableDirectives: true,
	rules: {
		'@stylistic/ts/member-delimiter-style': ['warn', {
			multiline: { delimiter: 'none', requireLast: false },
			singleline: { delimiter: 'comma', requireLast: false }
		}],
		'@stylistic/ts/semi': ['warn', 'never'],
		'import/order': 'warn',
		'indent': ['warn', 'tab'],
		'no-unused-vars': 'off',
		'quotes': ['warn', 'single'],
		'react/jsx-indent': ['warn', 'tab'],
		'semi': ['warn', 'never'],
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
