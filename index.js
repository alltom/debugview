var BrowserDebugView = require('./browser-debug-view');
var RemoteConnectionHub = require('./remote-connection-hub');
var commandLineArgs = require('command-line-args');
var commandLineUsage = require('command-line-usage');
var express = require('express');
var expressWs = require('express-ws');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var DEFAULT_REMOTE_PORT = 3009;

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
  },
  {
    name: 'port',
    alias: 'p',
    type: Number,
    description:
        'Port the debug server will listen on. In remote mode, the default port is ' +
        DEFAULT_REMOTE_PORT + '.'
  },
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
var port = options.port || (options.remote ? DEFAULT_REMOTE_PORT : 0);
var listener = app.listen(port, function() {
  if (options.remote) {
    // Listen for WebSocket connections, creating a new debug view for each one.
    new RemoteConnectionHub().listen(app, listener, function(stream) {
      new BrowserDebugView().open(app, listener, stream);
    });
  } else {
    // Echo program's stdout to stdout.
    process.stdin.pipe(process.stdout);

    // Open a debug view based on stdin.
    new BrowserDebugView().open(
        app, listener, process.stdin, function() { process.exit(); });
  }
});
