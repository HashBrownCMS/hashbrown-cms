'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');
const exec = require('child_process').exec;
const sass = require('sass/sass.dart.js');

let isWatching = Array.isArray(process.argv) ? process.argv.indexOf('--watch') > -1 : false;

// Define settings
module.exports = {
    mode: 'none',

    devtool: 'source-map',

    // Input .js
    entry: {
        dashboard: './src/Client/dashboard.js',
        demo: './src/Client/demo.js',
        environment: './src/Client/environment.js',
        
        routes: './src/Client/Routes',
        
        common: './src/Common',
        helpers: './src/Client/Helpers',
        models: './src/Client/Models',
        utilities: './src/Client/utilities',
        views: './src/Client/Views',
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
                            ['@babel/preset-env']
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

// Compile SASS
// NOTE: We're compiling SASS separately, since depending on the WebPack process is too slow
let sassArgs = [];

if(isWatching) { 
    sassArgs.push('--watch');
}

sassArgs.push('--source-map');
sassArgs.push('--embed-sources'),
sassArgs.push('./src/Client/Style/client.scss:./public/css/client.css');

sass.run_(sassArgs);
