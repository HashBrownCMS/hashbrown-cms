'use strict';

// Libs
let ExtractText = require('extract-text-webpack-plugin');

// Define settings
module.exports = {
    // The main .js file path
    entry: {
        'client': './src/client/js/client.js',
        'dashboard': './src/client/js/dashboard.js'
    },

    // Define loaders
    module: {
        loaders: [
            // Babel.js
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },

            // JSON
            {
                test: /\.json$/,
                loader: 'json'
            },

            // Sass
            {
                test: /\.scss$/,
                loader: ExtractText.extract('style', 'css-loader?sourceMap!sass-loader?sourceMap')
            }
        ]
    },

    // Automatically accept these extensions
    resolve: {
        extensions: ['', '.js', '.json', '.scss']
    },
    
    // Output .js file
    output: {
        filename: './public/js/[name].js'
    },

    // Output .css file
    plugins: [
        new ExtractText('./public/css/client.css', { allChunks: true })
    ]
};
