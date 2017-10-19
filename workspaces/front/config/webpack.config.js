const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getFullPath, readJson } = require('./utils');

const {
  PORT,
  DIR_BUNDLE,
} = require('./config');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    app: getFullPath('./src/app/entry.tsx'),
    worker: getFullPath('./src/worker/index.js')
  },

  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[hash].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[hash].js',
    path: getFullPath(DIR_BUNDLE),
    publicPath: isDev ? `http://localhost:${PORT}/` : '/',
    hotUpdateChunkFilename: '[id].[hash].hot-update.js',
    hotUpdateMainFilename: '[hash].hot-update.json',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      './guide.less$': getFullPath('src/app/components/guide.less'),
      'src/app': getFullPath('src/app'),
      'worker': getFullPath('src/worker'),
    },
  },

  module: {
    rules: [
      {
        test: /\.jpg/,
        issuer: /\.jsx/,
        loaders: 'file-loader',
      },
      {
        test: /.jsx?/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: readJson(getFullPath('.babelrc')),
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },

  watch: isDev,

  devtool: isDev ? 'source-map' : false,

  plugins: (() => {
    const plugins = [

      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale/,
        /en-gb\.js/
      ),
      new webpack.EnvironmentPlugin(['NODE_ENV']),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        children: true,
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'worker',
        children: true,
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['app', 'worker'],
        minChunks({ context }) {
          return context && context.indexOf('node_modules') !== -1;
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),

      1 || isDev
        ? null
        : new webpack.optimize.UglifyJsPlugin(),

      new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: true }),

      process.env.WEBPACK_ANALYZE
        ? new BundleAnalyzerPlugin()
        : false,
    ];

    return plugins.filter(x => x);
  })(),
};