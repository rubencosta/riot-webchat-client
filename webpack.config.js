'use strict';
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: ['webpack/hot/dev-server',path.join(__dirname, '/src/app/app.js')],
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            riot: 'riot'
        }),
        new HtmlWebpackPlugin({
            title: 'riot webchat client',
            template: './src/index.tpl.html',
            inject: true
        })
    ],
    module: {
        preLoaders: [
            { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
        ],
        loaders: [
            { test: /\.js|\.tag$/, exclude: /node_modules/, loader: '6to5-loader' }
        ]
    },
    devServer: {
        contentBase: './build'
    }
};