'use strict';
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var vendor_dir = path.join(__dirname,'/node_modules');


var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
        this.entry.push(name);
        if (!(path.indexOf('.css') > -1)) {
            this.module.noParse.push(new RegExp(path));
        }
    },
    resolve: {alias: {}},
    entry: ['webpack/hot/dev-server', path.join(__dirname, '/src/app/app.js')],
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
        noParse: [],
        preLoaders: [
            {test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: {type: 'es6'}}
        ],
        loaders: [
            {test: /\.js|\.tag$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},

        ]
    },
    devServer: {
        contentBase: './build'
    }
};

config.addVendor('material-design-lite', vendor_dir + '/material-design-lite/material.js');
config.addVendor('material-design-lite.css', vendor_dir + '/material-design-lite/material.css');

module.exports = config;
