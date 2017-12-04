module.exports = function (config) {
	config.set({
		browserNoActivityTimeout: 120000,
		frameworks: ['mocha'],
        plugins: ['karma-webpack', 'karma-mocha', 'karma-chrome-launcher'],

		preprocessors: {
			'./test/**/*.ts': ['webpack'],
		},

		reporters: ['progress'],
		browsers: ['Chrome'],
		singleRun: false,

		files: [
			'./test/*.test.ts'
		],

		mime: {
			'text/x-typescript': ['ts','tsx']
		},

		webpack: require('./front/config/webpack.config'),
	})
}