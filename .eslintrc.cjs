module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'xo',
		'plugin:react/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: {
				'comma-dangle': 'off',
				indent: ['warn', 'tab'],
				'object-curly-spacing': 'off',
				semi: 'off',
				'react/react-in-jsx-scope': 'off',
				'@typescript-eslint/comma-dangle': ['warn', 'never'],
				'@typescript-eslint/object-curly-spacing': ['warn', 'always'],
				'@typescript-eslint/semi': ['warn', 'never']
			}
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'react',
	],
	rules: {
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
