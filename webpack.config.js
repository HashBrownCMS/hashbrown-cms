'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');

let ExtractText = require('extract-text-webpack-plugin');

// Define settings
module.exports = {
    // Input .js
    entry: {
        client: './src/Client/client.js',
        dashboard: './src/Client/dashboard.js',
        demo: './src/Client/demo.js'
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
                test: /\.(json|schema)$/,
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
        modules: [path.resolve(__dirname), path.resolve(__dirname, 'src'), 'node_modules'],
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
