var webpack = require('webpack');
var ExtractText = require("extract-text-webpack-plugin");

module.exports = {
    entry:  [
        './src/scripts/index.js',
        './src/styles/index.scss',
    ],
    output: {
        path:     'build',
        filename: 'main.js',
    },
    module: {
        loaders: [
            {
                test:   /\.js/,
                loader: 'babel',
                include: __dirname + '/src',
                query: {
                    presets: ['es2015'],
                }
            },
            {
                test: /\.scss/,
                loader: ExtractText.extract('style', 'css!sass!import-glob')
            }
        ],
    },
    plugins: [
        new ExtractText('main.css'),
    ]
};