'use strict';

let express = require('express');
let plugincontroller = require('./src/controllers/plugin');
let bodyparser = require('body-parser');

let env = require('./env.json');

let app = express();

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/**
 * Init plugins
 * This will allow plugin routes to take presidence over native ones
 */
plugincontroller.init(app);

// Views
require('./src/routes/views')(app, env);

let server = app.listen(8000);
