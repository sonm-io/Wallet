(async () => {
  const path = require('path');
  const webpack = require('webpack');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const { getFullPath, readJson } = require('./utils');
  const extractLess = new ExtractTextPlugin('./style.css');
  const del = require('del');

  const {
    DIR_BUNDLE,
    WEBPACK_DEV_SERVER_PORT,
  } = require('./config');

  const isDev = process.env.NODE_ENV !== 'production';
  const cwd = process.cwd();

  del('./bundle/**');

  module.exports = {
    entry: {
      app: getFullPath('./src/entry.js'),
      style: getFullPath('./src/entry.less'),
    },

    output: {
      filename: isDev ? '[name].bundle.js' : '[name].[hash].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name].[hash].js',
      path: getFullPath(DIR_BUNDLE),
      publicPath: isDev ? '' : '/',
      hotUpdateChunkFilename: '[id].[hash].hot-update.js',
      hotUpdateMainFilename: '[hash].hot-update.json',
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
          options: readJson(getFullPath('.babelrc')),
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
          name: 'app',
          children: true,
        }),

        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          chunks: ['app', 'worker'],
          minChunks({ context }) {
            return context && context.indexOf('node_modules') !== -1;
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
        }),

        // isDev
        //   ? null
        //   : new webpack.optimize.UglifyJsPlugin(),

        new HtmlWebpackPlugin({
          template: './assets/entry.html',
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

    devServer: {
      contentBase: path.join(cwd, DIR_BUNDLE),
      quiet: false,
      stats: {
        errors: true,
        colors: true,
      },
      compress: true,
      hot: isDev,
      port: WEBPACK_DEV_SERVER_PORT,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  };

})();


