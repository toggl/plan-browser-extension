'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const join = p => path.join(__dirname, p);
const webpack = require('webpack');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postCSSInlineSVG = require('postcss-inline-svg');
const jsonImporter = require('node-sass-json-importer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const prd = false;

const noop = () => {};
const sourceMaps = prd ? 'cheap-module-eval-source-map' : false;
const platform = process.env.IS_FIREFOX === 'true' ? 'firefox' : 'chrome';

const miniCssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: { hmr: !prd },
};

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => {
      return [
        autoprefixer({
          browsers: ['last 2 Chrome versions', 'last 2 Firefox versions'],
        }),
        postCSSInlineSVG(),
      ];
    },
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sassOptions: {
      importer: jsonImporter(),
    },
  },
};

const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [
      path.resolve('./src/popup/styles/sass/variables.scss'),
      path.resolve('./src/popup/styles/sass/mixins.scss'),
    ],
  },
};

const MAIN_PACKAGES = ['background', 'popup', 'options'];

const entry = {};
MAIN_PACKAGES.forEach(p => {
  entry[p] = path.resolve(`src/${p}/${p}.js`);
});
fs.readdirSync('src/bootloader').forEach(f => {
  if (fs.lstatSync(path.resolve(`src/bootloader/${f}`)).isDirectory()) {
    entry[f] = path.resolve(`src/bootloader/${f}/${f}.js`);
  }
});

module.exports = {
  entry,
  output: {
    path: path.resolve('./build'),
    pathinfo: false,
    filename: '[name].js',
  },
  mode: !prd ? 'development' : 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true,
        },
      }),
    ],
    // splitChunks: {
    //   chunks: 'all',
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.dot$/,
        loader: 'dot-loader',
        options: {},
      },

      { test: /\.hbs$/, loader: 'handlebars-loader' },

      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },

      {
        test: /\.text\.css$/,
        use: ['to-string-loader', 'css-loader', postCSSLoader],
      },

      {
        test: /\.css$/,
        exclude: /\.text\.css$/,
        use: [
          !prd ? miniCssExtractLoader : 'style-loader',
          'css-loader',
          postCSSLoader,
        ],
      },

      {
        test: /\.module\.scss$/,
        use: [
          !prd ? miniCssExtractLoader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          postCSSLoader,
          sassLoader,
          sassResourcesLoader,
        ],
      },

      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          miniCssExtractLoader,
          'css-loader',
          postCSSLoader,
          sassLoader,
          sassResourcesLoader,
        ],
      },

      {
        test: /\.less$/,
        use: [miniCssExtractLoader, 'css-loader', postCSSLoader, 'less-loader'],
      },

      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      src: path.resolve('./src'),
    },
  },
  plugins: [
    new DashboardPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/images', to: 'images' },
      { from: `src/manifest.${platform}.json`, to: 'manifest.json' },
      { from: 'src/popup/fonts', to: 'fonts' },
    ]),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new webpack.ProvidePlugin({ $: 'jquery' }),
    new MiniCssExtractPlugin({
      filename: !prd ? '[name].css' : '[hash]-[name].css',
      chunkFilename: !prd ? '[id].css' : '[chunkhash]-[id].css',
    }),
    prd
      ? new OptimizeCssAssetsPlugin({
          cssProcessor: cssnano,
          cssProcessorOptions: { discardComments: { removeAll: true } },
          canPrint: true,
        })
      : noop,
    ...MAIN_PACKAGES.map(
      template =>
        new HtmlWebpackPlugin({
          filename: `${template}.html`,
          template: join(`src/${template}/${template}.html`),
          chunks: [template],
          minify: prd
            ? false
            : {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
              },
        })
    ),
  ],

  devtool: sourceMaps,

  devServer: {
    clientLogLevel: 'warn',
    compress: true,
    contentBase: path.join(__dirname, 'build'),
    hot: !prd,
    inline: !prd,
    port: Number(process.env.PORT) || 2323,
    // stats: 'minimal',
  },
};
