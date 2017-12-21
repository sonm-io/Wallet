const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {getFullPath, readJson} = require('./utils');
const extractLess = new ExtractTextPlugin('./style.css');

const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isDev = !process.env.NODE_ENV.includes('production');
const buildType = process.env.BUILD_TYPE || '';

module.exports = {
    entry: {
        app: getFullPath('./src/app/index.tsx'),
        style: getFullPath('./src/app/less/entry.less'),
    },

    output: {
        filename: '[name].bundled.js',
        path: getFullPath('../docs'),
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        alias: {
            './guide.less$': getFullPath('src/app/less/guide.less'),
            'app': getFullPath('src/app'),
            'worker': getFullPath('src/worker'),
            './node_modules': getFullPath('../node_modules'),
        },
    },

    module: {
        rules: (() => {
            const rules = [
                {
                    test: /\.svg/,
                    issuer: /\.less/,
                    loaders: 'svg-url-loader',
                },
                {
                    test: /\.(ttf|jpg)$/,
                    loader: 'file-loader',
                },
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: readJson('.babelrc'),
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.less$/,
                    use: extractLess.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader'],
                    }),
                },
                {
                    test: /\.worker\.ts$/,
                    use: [{
                        loader: 'worker-loader',
                        options: {
                            name: '[name].js',
                            inline: true,
                        },
                    }, {
                        loader: 'ts-loader',
                    }],
                },
            ];

            return rules.filter(x => x);
        })(),
    },

    watch: isDev,
    devtool: false,

    plugins: (() => {
        const plugins = [
            process.env.WEBPACK_ANALYZE
                ? new BundleAnalyzerPlugin()
                : false,

            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale/,
                /en-gb\.js/,
            ),

            new webpack.optimize.ModuleConcatenationPlugin(),

            isDev ? null : new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false,
                        ascii_only: true,
                    },
                }
            }),

            new webpack.EnvironmentPlugin(['NODE_ENV']),

            new HtmlWebpackPlugin({
                inject: true,
                template: getFullPath('./assets/entry.html'),
            }),

            extractLess,
        ];

        if (buildType === 'singleFile') {
            plugins.push(new StyleExtHtmlWebpackPlugin());
        }

        return plugins.filter(x => x);
    })(),
};
