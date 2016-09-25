var byline = require('byline');
var handlers = require('./handlers');
var opn = require('opn');
var url = require('url');

var nextViewerId = 1;

// Browser-based log viewer.
function BrowserDebugView() {
  this._lineStream = null;
  this._webSocket = null;
  this._socketPath = '/view' + (nextViewerId++);
}

// Opens the debug view. Serves itself from the given Express app.
BrowserDebugView.prototype.open = function(app, httpListener, logInputStream) {
  this._setupStreamHandlers(logInputStream);
  this._setupExpressHandlers(app);

  var addr = httpListener.address();
  opn(url.format({
    protocol: 'http',
    hostname: addr.address,
    port: addr.port,
    pathname: '/',
    query: {socketPath: this._socketPath}
  }));
};

BrowserDebugView.prototype._setupStreamHandlers = function(logInputStream) {
  this._lineStream =
      byline.createStream(logInputStream, {keepEmptyLines: true});

  this._lineStream.on('readable', this._read.bind(this));
  this._lineStream.on('end', function() {
    if (this._webSocket) {
      this._webSocket.send(JSON.stringify({event: 'end'}));
    }
  }.bind(this));
};

BrowserDebugView.prototype._setupExpressHandlers = function(app) {
  app.ws(this._socketPath, function(ws, req) {
    this._webSocket = ws;
    this._webSocket.on('close', function() { process.exit(); });
    this._read();
  }.bind(this));
};

BrowserDebugView.prototype._read = function() {
  if (!this._webSocket) return;

  // https://developer.mozilla.org/ja/docs/Web/API/WebSocket#Ready_state_constants
  while (this._webSocket.readyState == 1 /* open */) {
    var line = this._lineStream.read();
    if (line === null) break;

    handlers(line).forEach(function(item) {
      item.event = 'data';
      this._webSocket.send(JSON.stringify(item));
    }.bind(this));
  }
};

module.exports = BrowserDebugView;
