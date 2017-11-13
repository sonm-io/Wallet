const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getFullPath, readJson } = require('./utils');
const extractLess = new ExtractTextPlugin('./style.css');
const ShakePlugin = require('webpack-common-shake').Plugin;

const isDev = process.env.NODE_ENV !== 'production';
const isAnalyze = process.env.WEBPACK_ANALYZE;

console.log(getFullPath('./src/entry.js'));

module.exports = {
  entry: {
    app: getFullPath('./src/app/index.tsx'),
    worker: getFullPath('./src/worker/back.worker.js'),
    style: getFullPath('./src/app/less/entry.less'),
  },

  output: {
    filename: '[name].bundled.js',
    path: getFullPath('dist'),
    publicPath: isDev ? '' : '/',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      './guide.less$': getFullPath('src/app/less/guide.less'),
      'src/app': getFullPath('src/app'),
      'worker': getFullPath('src/worker'),
    },
  },

  module: {
    rules: (() => {
      const rules = [
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
      ];

      return rules.filter(x => x);
    })(),
  },

  watch: isDev,

  devtool: isDev ? 'source-map' : false,

  plugins: (() => {
    const plugins = [
      process.env.WEBPACK_ANALYZE
        ? new BundleAnalyzerPlugin()
        : false,

      // new ShakePlugin(),

      new HtmlWebpackPlugin({
        template: getFullPath('./assets/entry.html'),
      }),

      extractLess,

      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale/,
        /en-gb\.js/
      ),

      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   minChunks(params) {
      //     const { context } = params;
      //     return context && context.indexOf('node_modules') !== -1;
      //   },
      // }),

      new webpack.optimize.ModuleConcatenationPlugin(),

      // isDev
      //   ? null
      //   : new webpack.optimize.UglifyJsPlugin(),

      // isDev
      //   ? new webpack.NamedModulesPlugin()
      //   : false,

      // isDev
      //   ? new webpack.HotModuleReplacementPlugin()
      //   : null,

      new webpack.EnvironmentPlugin(['NODE_ENV']),
    ];

    return plugins.filter(x => x);
  })(),
};




