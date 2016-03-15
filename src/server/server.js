'use strict';

// ----------
// Libs
// ----------
let Promise = require('bluebird');
let express = require('express');
let bodyparser = require('body-parser');

Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');
app.set('views', appRoot + '/src/server/views');

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(appRoot + '/public'));

// ----------
// Ready callback
// ----------
function ready() {
    let server = app.listen(8000);

    console.log('[Endomon CMS] Running on port 8000');
}

// ----------
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let PluginController = require(appRoot + '/src/server/controllers/PluginController');

ApiController.init(app);
PluginController.init()
    .then(ready);

// ----------
// View
// ----------
app.get('/', function(req, res) {
    res.render('index');
});

