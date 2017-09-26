const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CheckerPlugin } = require('awesome-typescript-loader');
const { getFullPath } = require('./utils');

const {
  TITLE,
  PORT,
  WEBPACK_DEV_SERVER_PORT,
  DIR_ASSETS,
  DIR_DIST,
} = require('./config');

const isDev = process.env.NODE_ENV !== 'production';
const cwd = process.cwd();

module.exports = {
  entry: isDev ? [
    `webpack-hot-middleware/client?http://localhost:${PORT}/`,
    'webpack/hot/only-dev-server',
    getFullPath('./src/entry.jsx'),
  ] : [
    getFullPath('./src/entry.jsx'),
  ],

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
        test: /\.pug/,
        loaders: 'pug-loader',
      },
      {
        test: /\.svg/,
        issuer: /\.less/,
        loaders: 'svg-url-loader',
      },
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
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.css/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less/,
        issuer: /.jsx?/,
        loaders: (() => {
          const use = [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
                localIdentName: '[name]-[local]-[hash:base64:5]',
                importLoaders: 1,
                minimize: !isDev,
              },
            },
            'postcss-loader',
            'less-loader',
          ];

          return isDev ? ['style-loader', ...use] : ExtractTextPlugin.extract({ use });
        })(),
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
      new HtmlWebpackPlugin({
        hash: false,
        title: TITLE,
        template: './src/entry.html',
      }),
    ];

    const extraPlugins = isDev
      ? [
        new webpack.ProvidePlugin({
          DevTool: 'mobx-react-devtools',
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ]
      : [
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: true }),
        new CopyPlugin(
          [
            {
              context: path.join(cwd, DIR_ASSETS),
              from: '**/*',
              to: path.join(cwd, DIR_DIST),
            },
          ],
        ),
      ];

    if (process.env.ANALYZE) {
      extraPlugins.push(new BundleAnalyzerPlugin());
    }

    return [...plugins, ...extraPlugins];
  })(),

  devServer: {
    contentBase: path.join(cwd, DIR_ASSETS),
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