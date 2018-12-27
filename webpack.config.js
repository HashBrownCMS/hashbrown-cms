'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');
const exec = require('child_process').exec;

// Define settings
module.exports = {
    mode: 'none',

    devtool: 'source-map',

    // Input .js
    entry: {
        client: './src/Client/client.js',
        dashboard: './src/Client/dashboard.js',
        demo: './src/Client/demo.js'
    },

    // Output .js
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js'
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
                            ['@babel/preset-env', { loose: true, modules: false }]
                        ]
                    }
                }
            }
        ]
    },

    // Automatically accept these extensions
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.json', '.schema']
    }
};

// Watch SASS
let sass = require('./node_modules/sass/sass.dart.js');
   
sass.run_([
    '--watch',
    '--source-map',
    '--embed-sources',
    './src/Client/Style/client.scss:./public/css/client.css'
]);
