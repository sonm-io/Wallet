const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getFullPath } = require('./utils');

const {
  PORT,
  DIR_DIST,
} = require('./config');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: getFullPath('./src/entry.tsx'),

  output: {
    filename: isDev ? '[name].bundle.js' : '[name].[hash].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[hash].js',
    path: getFullPath(DIR_DIST),
    publicPath: isDev ? `http://localhost:${PORT}/` : '/',
    hotUpdateChunkFilename: '[id].[hash].hot-update.js',
    hotUpdateMainFilename: '[hash].hot-update.json',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
    alias: {
      './guide.less$': getFullPath('src/app/components/guide.less'),
      components: getFullPath('src/app/components'),
      layouts: getFullPath('src/app/components/layouts'),
      stores: getFullPath('src/app/stores'),
      lib: getFullPath('src/lib'),
      const: getFullPath('src/const'),
      app: getFullPath('src/app'),
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
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale/,
        /en-gb\.js/
      ),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'main',
        children: true,
        minChunks: 2,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks({ context }) {
          return context && context.indexOf('node_modules') !== -1;
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),
      new webpack.optimize.UglifyJsPlugin(),
      new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: true }),
      new BundleAnalyzerPlugin(),
    ];

    return [...plugins];
  })(),
};