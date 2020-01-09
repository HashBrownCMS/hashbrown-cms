'use strict';

// Libs
const Path = require('path');
const Webpack = require('webpack');
const Sass = require('sass/sass.dart.js');
const FileSystem = require('fs');

// Observe changes for specific files
let entry = {
    dashboard: './src/Client/dashboard.js',
    demo: './src/Client/demo.js',
    environment: './src/Client/environment.js',

    common: './src/Common',
    service: './src/Client/Service',
    entity: './src/Client/Entity',
    utilities: './src/Client/utilities'
}

// Include plugins
let pluginsPath = Path.join(__dirname, 'plugins');
let pluginFiles = [];

if(FileSystem.existsSync(pluginsPath)) {
    for(let plugin of FileSystem.readdirSync(pluginsPath)) {
        let indexPath = Path.join(pluginsPath, plugin, 'src', 'Client', 'index.js');

        if(!FileSystem.existsSync(indexPath)) { continue; }

        pluginFiles.push(indexPath);
    }
}

if(pluginFiles.length > 0) {
    entry.plugins = pluginFiles;
}

// Are we watching for changes?
let isWatching = false;

// Process input arguments
if(Array.isArray(process.argv)) {
    for(let arg of process.argv) {
        if(arg === '--watch') {
            isWatching = true;
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
        path: Path.resolve(__dirname, 'public/js'),
        filename: '[name].js'
    },

    // Automatically accept these extensions
    resolve: {
        modules: [Path.resolve(__dirname), Path.resolve(__dirname, 'src'), 'node_modules'],
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
sassArgs.push('./style/index.scss:./public/css/style.css');

Sass.run_(sassArgs);
