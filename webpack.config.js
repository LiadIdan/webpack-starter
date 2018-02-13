const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

const generateHtml = new HtmlWebpackPlugin({ template: `${SRC_DIR}/index.pug` });
const extractCSS = new ExtractTextPlugin('styles/[name].css', { allChunks: true });

const config = {
  entry: {
    app: `${SRC_DIR}/ts/app.ts`
  },
  output: {
    filename: 'js/[name].js',
    path: DIST_DIR
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      '../../theme.config$': path.resolve(__dirname, 'theme/theme.config')  
    },
    extensions: ['.scss', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }))
      },
      {
        test: /\.less$/,
        use: ['css-hot-loader'].concat(extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }))
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        exclude: path.resolve(`${__dirname}/node_modules/semantic-ui-less/themes/default/assets/fonts/icons.svg`),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              webp: {
                quality: 70
              }
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$|\.(ttf|eot)$|(icons.svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    hot: true,
    open: true,
    port: 8000,
    overlay: true,
    compress: true,
    contentBase: DIST_DIR
  },
  plugins: [
    generateHtml,
    extractCSS,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;