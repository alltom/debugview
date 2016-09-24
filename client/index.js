var handlers = require('./handlers');

var socket = new WebSocket('ws://' + window.location.host);
socket.onopen = function() {
  document.body.className = 'connected';
};
socket.onclose = function() {
  document.body.className = 'disconnected';
};
socket.onmessage = function(evt) {
  var data = JSON.parse(evt.data);
  console.log(data);
  if (data['event'] == 'end') {
    socket.close();
  } else {
    handlers(data, {
      appendElement: appendElement,
      appendHtml: appendHtml,
      appendText: appendText,
      appendError: appendText
    });
  }
};

function appendElement(elem) {
  document.body.appendChild(elem);
}

function appendHtml(html) {
  var elem = document.createElement('div');
  elem.className = 'log-item html';
  elem.innerHTML = html;
  document.body.appendChild(elem);
}

function appendText(text) {
  var elem = document.createElement('div');
  elem.className = 'log-item raw';
  elem.appendChild(document.createTextNode(text))
  document.body.appendChild(elem);
}
