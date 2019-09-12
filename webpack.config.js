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
    dashboard: './lib/Client/dashboard.js',
    demo: './lib/Client/demo.js',
    environment: './lib/Client/environment.js',
    
    route: './lib/Client/Route',
    
    common: './lib/Common',
    service: './lib/Client/Service',
    entity: './lib/Client/Entity',
    utilities: './lib/Client/utilities',
    view: './lib/Client/View'
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

    // Automatically accept these extensions
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, 'lib'), 'node_modules'],
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
sassArgs.push('./lib/Client/Style/client.scss:./public/css/client.css');

sass.run_(sassArgs);
