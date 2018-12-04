'use strict';

// Libs
const path = require('path');
const webpack = require('webpack');
const exec = require('child_process').exec;

// Watch SASS
let sass = exec('sass --sourcemap=none --watch ./src/Client/Style/client.scss:./public/css/client.css'); 

sass.stdout.on('data', (data) => {
    console.log(data); 
});

sass.stderr.on('data', (data) => {
    console.log(data);
});    

// Define settings
module.exports = {
    mode: 'none',

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
            }
        ]
    },

    // Automatically accept these extensions
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.json', '.schema']
    }
};
