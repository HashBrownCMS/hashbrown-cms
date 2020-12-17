'use strict';

// Libs
const Path = require('path');
const Webpack = require('webpack');
const Sass = require('sass/sass.dart.js');
const FileSystem = require('fs');

// Parameters
const IS_WATCHING = Array.isArray(process.argv) && process.argv.indexOf('--watch') > -1;
const TMP_PATH = Path.join(__dirname, 'tmp');
const PLUGINS_PATH = Path.join(__dirname, 'plugins');
const PUBLIC_PATH = Path.join(__dirname, 'public');
const PUBLIC_JS_PATH = Path.join(PUBLIC_PATH, 'js');
const PUBLIC_CSS_PATH = Path.join(PUBLIC_PATH, 'css');

/**
 * Gets all .js entries
 */
function getJsEntries() {
    // Include main codebase files
    let entry = {
        dashboard: './src/Client/dashboard.js',
        environment: './src/Client/environment.js',

        utilities: './src/Common/utilities',
        
        controller: './src/Client/Controller',
        service: './src/Client/Service',
        entity: './src/Client/Entity'
    }

    // Include plugins
    FileSystem.writeFileSync(Path.join(PUBLIC_JS_PATH, 'plugins.js'), '/* No plugins installed */');
    
    let pluginScripts = [];

    if(FileSystem.existsSync(PLUGINS_PATH)) {
        for(let plugin of FileSystem.readdirSync(PLUGINS_PATH)) {
            let scriptPath = Path.join(PLUGINS_PATH, plugin, 'src', 'Client', 'index.js');

            if(!FileSystem.existsSync(scriptPath)) { continue; }

            pluginScripts.push(scriptPath);
        }
    }

    if(pluginScripts.length > 0) {
        entry.plugins = pluginScripts;
    }

    return entry;
}

/**
 * Runs the SASS compilation
 */
function compileCss() {
    // Build SASS commands
    let sassArgs = [];

    if(IS_WATCHING) { 
        sassArgs.push('--watch');
        sassArgs.push('--poll');
    }

    sassArgs.push('--source-map');
    sassArgs.push('--embed-sources'),

    // Include main codebase styling
    sassArgs.push('./style/index.scss:./public/css/style.css');

    // Start SASS compilation
    Sass.run_(sassArgs);
}

// Define settings
module.exports = {
    mode: 'none',
    devtool: 'source-map',

    // Input .js
    entry: getJsEntries(),

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

// Compile CSS
compileCss();
