var byline = require('byline');
var handlers = require('./handlers');
var opn = require('opn');

// Browser-based log viewer. Serves itself from the given Express app.
function BrowserDebugView(app, logInputStream) {
  this._lineStream =
      byline.createStream(logInputStream, {keepEmptyLines: true});
  this._webSocket = null;

  this._setupStreamHandlers();
  this._setupExpressHandlers(app);
}

// Opens the debug view.
BrowserDebugView.prototype.open = function(httpListener) {
  var addr = httpListener.address();
  // TODO: Don't assume IPv6.
  opn('http://[' + addr.address + ']:' + addr.port + '/');
};

BrowserDebugView.prototype._setupStreamHandlers = function() {
  this._lineStream.on('readable', this._read.bind(this));
  this._lineStream.on('end', function() {
    if (this._webSocket) {
      this._webSocket.send(JSON.stringify({event: 'end'}));
    }
  }.bind(this));
};

BrowserDebugView.prototype._setupExpressHandlers = function(app) {
  // TODO: Use a more specific URL.
  app.ws('/', function(ws, req) {
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
