'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');
const exec = require('child_process').exec;
const sass = require('sass/sass.dart.js');

// Are we watching for changes?
let isWatching = false;

// Observe changes for specific files
let entry = {
    dashboard: './src/Client/dashboard.js',
    demo: './src/Client/demo.js',
    environment: './src/Client/environment.js',
    
    routes: './src/Client/Routes',
    
    common: './src/Common',
    helpers: './src/Client/Helpers',
    models: './src/Client/Models',
    utilities: './src/Client/utilities',
    views: './src/Client/Views'
}

// Process input arguments
if(Array.isArray(process.argv)) {
    for(let arg of process.argv) {
        // Watching
        if(arg === '--watch') {
            isWatching = true;
        
        // Files
        } else if(arg.indexOf('--files') === 0) {
            arg = arg.replace('--files', '');

            let files = {};

            for(let file of arg.match(/[a-z]*/g)) {
                if(!file) { continue; }
                if(!entry[file]) { throw new Error('File "' + file + '.js" not found'); }

                files[file] = entry[file];
            }

            entry = files;
        }
    }
}

// Define settings
module.exports = {
    mode: 'none',

    devtool: 'source-map',

    // Input .js
    entry: entry,

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
