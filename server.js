'use strict';

// ----------
// Plugins
// ----------
let express = require('express');
let bodyparser = require('body-parser');

// ----------
// Controllers
// ----------
let ApiController = require('./src/server/controllers/ApiController');

// ----------
// Config
// ----------
let config = require('./config.json');

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// ----------
// Server
// ----------
let server = app.listen(8000);

console.log('Putaitu CMS running on port 8000');
