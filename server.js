'use strict';

// ----------
// Plugins
// ----------
let Promise = require('bluebird');
let express = require('express');
let bodyparser = require('body-parser');

Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

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

new ApiController(app);

// ----------
// View
// ----------
app.get('/', function(req, res) {
    res.render('index');
});

// ----------
// Server
// ----------
let server = app.listen(8000);

console.log('Putaitu CMS running on port 8000');
