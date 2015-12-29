'use strict';

/**
 * Plugins
 * Load the plugin modules
 */
let express = require('express');
let plugincontroller = require('./src/controllers/plugin');
let bodyparser = require('body-parser');

/**
 * Environment config
 * Read the config file
 */
let env = require('./env.json');

/**
 * App
 * Initialise the application
 */
let app = express();

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/**
 * Pugins
 * This will allow plugin routes to take precedence over native ones
 */
plugincontroller.init(app);

/**
 * Views
 * Init all views in a separate module
 */
require('./src/routes/views')(app, env);

/**
 * Routine
 * Run the server listening routine
 */
let server = app.listen(8000);
