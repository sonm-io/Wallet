module.exports = function(config) {
    config.set({
        browserNoActivityTimeout: 120000,
        frameworks: ['mocha'],
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-teamcity-reporter',
        ],

        preprocessors: {
            './**/*.test.ts': ['webpack'],
        },

        reporters: ['progress'],
        browsers: ['Chrome', 'ChromeHeadless'],
        singleRun: false,

        files: ['./front/src/**/*.test.ts', './test/**/*.test.ts'],

        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },

        webpack: require('./front/config/webpack.base-config'),
    });
};
