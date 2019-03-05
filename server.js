const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors');
const app = express();
const timeout = require('connect-timeout'); //express v4

//Cors
app.use(cors());
app.options('*', cors());
app.set('views', 'server/views');
app.set('view engine', 'pug');
// API file for interacting with api route
const api_asset = require('./server/routes/api_asset');
const api_out = require('./server/routes/api_out');
const api_back = require('./server/routes/api_back');

// Parsers
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
//our route
app.use('/api/asset', api_asset);
app.use('/api/out', api_out);
app.use('/api/back', api_back);
app.use(timeout('8000s'));
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

//Set Port
const port = '3399';
app.set('port', port);
http.globalAgent.maxSockets = Infinity;
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));