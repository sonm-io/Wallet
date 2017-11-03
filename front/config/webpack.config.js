const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getFullPath, readJson } = require('./utils');
const extractLess = new ExtractTextPlugin('./style.css');
// const del = require('del');

const isDev = process.env.NODE_ENV !== 'production';

// del('./bundle/**');

console.log(getFullPath('./src/entry.js'));

module.exports = {
  entry: () => {
    const entries = {
      app: getFullPath('./src/entry.js'),
      style: getFullPath('./src/entry.less'),
    };

    if (process.env.WEBPACK_ANALYZE) {
      entries.worker = getFullPath('./src/worker/back.worker.js');
    }

    return entries;
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
      './guide.less$': getFullPath('src/guide.less'),
      'src/app': getFullPath('src/app'),
      'worker': getFullPath('src/worker'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ttf|jpg)$/,
        loader: 'file-loader',
      },
      {
        test: /.worker.js$/,
        loader: 'worker-loader',
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
    ],
  },

  watch: isDev,

  devtool: isDev ? 'source-map' : false,

  plugins: (() => {
    const plugins = [

      new webpack.optimize.ModuleConcatenationPlugin(),

      extractLess,

      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale/,
        /en-gb\.js/
      ),
      
      new webpack.EnvironmentPlugin(['NODE_ENV']),

      new webpack.optimize.CommonsChunkPlugin({
        children: true,
      }),

      // isDev
      //   ? null
      //   : new webpack.optimize.UglifyJsPlugin(),

      new HtmlWebpackPlugin({
        template: getFullPath('./assets/entry.html'),
      }),

      process.env.WEBPACK_ANALYZE
        ? new BundleAnalyzerPlugin()
        : false,

      isDev
        ? new webpack.NamedModulesPlugin()
        : null,

      // isDev
      //   ? new webpack.HotModuleReplacementPlugin()
      //   : null,

    ];

    return plugins.filter(x => x);
  })(),
};




