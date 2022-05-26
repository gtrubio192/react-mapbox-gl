const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',

  entry: {
    app: './src/index.js'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: { modules: true, exportOnlyLocals: false }
              },
              'sass-loader'
            ]
          },
          {
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/react', 
                {
                  plugins: ['@babel/plugin-transform-runtime']
                }
              ]
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({title: 'NREL Interactive Map'}),
    new Dotenv(),
    new MiniCssExtractPlugin()
  ]
};