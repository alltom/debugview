var byline = require('byline');
var express = require('express');
var expressWs = require('express-ws');
var opn = require('opn');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');

// Echo program's stdout to stdout.
process.stdin.pipe(process.stdout);

// The program's stdout as a stream of lines.
var lineStream = byline.createStream(process.stdin, {keepEmptyLines: true});

// Create a web server.
var app = express();
app.use(express.static('public'));
app.use(webpackDevMiddleware(webpack(require('./webpack.config'))));

// Handle WebSocket connections.
expressWs(app);
app.ws('/', function(ws, req) {
  ws.on('close', function() { process.exit(); });

  lineStream.on('readable', read);
  lineStream.on('end', function() { ws.send(JSON.stringify({event: 'end'})); });
	read();

  function read() {
    // https://developer.mozilla.org/ja/docs/Web/API/WebSocket#Ready_state_constants
    while (ws.readyState == 1 /* open */) {
      var line = lineStream.read();
      if (line === null) break;
      ws.send(JSON.stringify({data: line.toString('utf8')}));
    }
  }
});

// Listen for connections on any open port & open a web browser.
var listener = app.listen(function() {
  var addr = listener.address();
  opn('http://[' + addr.address + ']:' + addr.port + '/');
});
