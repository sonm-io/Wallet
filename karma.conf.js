module.exports = function (config) {
	config.set({
		browserNoActivityTimeout: 60000,
		frameworks: ['mocha', 'karma-typescript'],
        plugins: ['karma-webpack', 'karma-mocha', 'karma-chrome-launcher', 'karma-typescript', 'karma-browserify'],

		preprocessors: {
            './front/src/**/*.ts': ['webpack'], //, 'browserify'
			'./test/**/*.ts': ['karma-typescript'], //
		},

		reporters: ['progress'],
		browsers: ['Chrome'],
		singleRun: false,

		files: [
			'./front/src/**/*.ts',
			'./test/*.test.ts'
		],

		webpack: require('./front/config/webpack.config'),

		karmaTypescriptConfig: {
			tsconfig: './tsconfig.json',
			include: ['test'],

			coverageOptions: {
				instrumentation: false,
			},
		},
	})
}