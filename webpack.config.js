'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');

let ExtractText = require('extract-text-webpack-plugin');

// Define settings
module.exports = {
    // Input .js
    entry: {
        client: './src/client/js/client.js',
        dashboard: './src/client/js/dashboard.js'
    },
    
    // Output .js
    output: {
        filename: './public/js/[name].js'
    },


    // Define loaders
    module: {
        rules: [
            // Babel.js
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['es2015', { loose: true, modules: false }]
                        ]
                    }
                }
            },

            // JSON
            {
                test: /\.json$/,
                use: 'json-loader'
            },

            // Sass
            {
                test: /\.scss$/,
                loader: ExtractText.extract(['css-loader', 'sass-loader'])
            }
        ]
    },

    // Automatically accept these extensions
    resolve: {
        extensions: ['.js', '.json', '.scss']
    },
    
    // Output .css file
    plugins: [
        new ExtractText({
            filename: './public/css/client.css',
            allChunks: true
        })
    ]
};
