module.exports = function (config) {
	config.set({
		browserNoActivityTimeout: 60000,
		frameworks: ['mocha', 'karma-typescript'],
		preprocessors: {
			'./front/src/worker/**/*.ts': ['karma-typescript'],
			'./test/**/*.ts': ['karma-typescript'],
		},

		reporters: ['progress', 'karma-typescript'],
		browsers: ['Chrome'],
		singleRun: true,
		files: [
			'./front/src/worker/**/*.ts',
			'./test/*.test.ts'
		],
		karmaTypescriptConfig: {
			tsconfig: './tsconfig.json',
			include: ['test'],

			coverageOptions: {
				instrumentation: false,
			},
		}
	})
}