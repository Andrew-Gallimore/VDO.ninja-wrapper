const express = require('express');
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express();
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/', express.static(__dirname + '/'));

const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'SSLcert', 'server.key')),
      cert: fs.readFileSync(path.join(__dirname, 'SSLcert', 'server.crt')),
    },
    app
)

var port = process.env.PORT || 443;
sslServer.listen(port, () => console.log("Server Started.", "\x1b[1m", "\x1b[36m", "(Port: " + port + ")", "\x1b[0m"))