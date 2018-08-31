'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');

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
                            ['@babel/preset-env', { loose: true, modules: false }]
                        ]
                    }
                }
            },

            // JSON
            {
                test: /\.(json|schema)$/,
                use: 'json-loader'
            },
        ]
    },

    // Automatically accept these extensions
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.json']
    }
};
