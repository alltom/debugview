var BrowserDebugView = require('./browser-debug-view');
var RemoteConnectionHub = require('./remote-connection-hub');
var commandLineArgs = require('command-line-args');
var commandLineUsage = require('command-line-usage');
var express = require('express');
var expressWs = require('express-ws');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var commandLineOptions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this usage guide.'
  },
  {
    name: 'remote',
    alias: 'r',
    type: Boolean,
    description:
        'Instead of reading stdin (the default), listen for WebSocket connections. Also prints information about how to connect via WebSockets.'
  }
];
var options = commandLineArgs(commandLineOptions);

if (options.help) {
  console.log(commandLineUsage([
    {
      header: 'debugview',
      content: 'Language-agnostic debugging widgets based on print statements'
    },
    {header: 'Options', optionList: commandLineOptions}
  ]));
  process.exit();
}

// Create a web server.
var app = express();
expressWs(app);  // Handle WebSocket connections.
app.use(express.static('public'));
app.use(webpackDevMiddleware(
    webpack(require('./webpack.config')), {noInfo: true, quiet: true}));

// Listen for connections on any open port & show the debug view.
var listener = app.listen(function() {
  if (options.remote) {
    new RemoteConnectionHub().listen(app, listener, function(stream) {
      new BrowserDebugView().open(app, listener, stream);
    });
  } else {
    // Echo program's stdout to stdout.
    process.stdin.pipe(process.stdout);

    // Open a debug view based on stdin.
    new BrowserDebugView().open(app, listener, process.stdin);
  }
});
