var BrowserDebugView = require('./browser-debug-view');
var express = require('express');
var expressWs = require('express-ws');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');

// Create a web server.
var app = express();
expressWs(app);  // Handle WebSocket connections.
app.use(express.static('public'));
app.use(webpackDevMiddleware(
    webpack(require('./webpack.config')), {noInfo: true, quiet: true}));

// Listen for connections on any open port & show the debug view.
var listener = app.listen(function() {
  // Echo program's stdout to stdout.
  process.stdin.pipe(process.stdout);

	// Open a debug view based on stdin.
  var debugView = new BrowserDebugView(app, process.stdin);
  debugView.open(listener);
});
