var url = require('url');

// Connect to debugview.
var socket = new WebSocket('ws://' + window.location.host + '/write');
socket.onopen = function() {
  flush();
};
socket.onclose = function() {
  console.error('lost connection to debugview.');
};

var queuedEntries = [];
function flush() {
  while (queuedEntries.length > 0 && socket.readyState == 1 /* open */) {
    socket.send(JSON.stringify(queuedEntries.shift()));
  }
}
function push(data) {
  queuedEntries.push(data);
  flush();
}

// Override console.log.
// TODO: console.error? console.dir? others?
var log = console.log;
console.log = function() {
  log.apply(console, arguments);
  push({data: Array.prototype.map.call(arguments, String).join(' ') + '\n'});
};
