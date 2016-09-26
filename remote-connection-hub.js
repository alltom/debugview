var Readable = require('stream').Readable;
var path = require('path');
var url = require('url');

var SOCKET_PATH = '/write';

// TODO: Serve this directly instead of relying on global webpack config.
var SCRIPT_PATH = '/remote.bundle.js';

function RemoteConnectionHub() {}

RemoteConnectionHub.prototype.listen = function(
    app, httpListener, debugViewCallback) {
  app.ws(SOCKET_PATH, function(ws, req) {
    var logStream = Readable();
    logStream._read = function() {};

    debugViewCallback(logStream);

    ws.on('message', function(msg) { logStream.push(JSON.parse(msg).data); });
    ws.on('close', function() { logStream.push(null); });
  }.bind(this));

  console.log(
      'Add this script tag to the page you want to debug, ABOVE any other scripts:');

  var addr = httpListener.address();
  console.log('<script src="' + url.format({
    protocol: 'http',
    hostname: addr.address,
    port: addr.port,
    pathname: SCRIPT_PATH
  }) + '"></script>');
};

module.exports = RemoteConnectionHub;
