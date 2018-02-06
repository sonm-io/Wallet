const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getFullPath, readJson } = require('./utils');

const MinifyPlugin = require("babel-minify-webpack-plugin");

const buildType = process.env.BUILD_TYPE || '';
const isDev = process.env.NODE_ENV !== 'production';
const sourceMap = false; // process.env.SOURCE_MAP ? 'source-map' : undefined;

const extractLess = new ExtractTextPlugin({
    filename: isDev ? '[name].css' : '[name].[contenthash].css',
    allChunks: true,
});

module.exports = {
    entry: {
        app: getFullPath('./src/entry.ts'),
        style: getFullPath('./src/app/less/entry.less'),
    },

    output: {
        filename: isDev ? '[name].js' : '[name].[hash].js',
        path: buildType === 'web' ? getFullPath('../docs') :  getFullPath('../dist'),
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
                        disable:  buildType === 'singleFile',
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader'],
                    }),
                },
                {
                    test: /\.worker\.ts$/,
                    use: [{
                        loader: 'worker-loader',
                        options: {
                            name: isDev ? '[name].js' : '[name].[hash].js',
                            inline: buildType === 'singleFile',
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

    devtool: sourceMap,

    plugins: (() => {
        const plugins = [
            process.env.WEBPACK_ANALYZE
                ? new BundleAnalyzerPlugin()
                : false,

            new HtmlWebpackPlugin({
                inject: true,
                template: getFullPath('./assets/entry.html'),
                inlineSource: '.(js|css)$',
            }),

            buildType === 'singleFile'
                ? new HtmlWebpackInlineSourcePlugin()
                : null,

            isDev ? null : new MinifyPlugin({
            }, {
                sourceMap: sourceMap,
            }),

            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale/,
                /en-gb\.js/,
            ),

            // new webpack.optimize.ModuleConcatenationPlugin(),

            new webpack.EnvironmentPlugin(['NODE_ENV']),

            extractLess,

            new CssoWebpackPlugin(),
        ];

        return plugins.filter(x => x);
    })(),
};
