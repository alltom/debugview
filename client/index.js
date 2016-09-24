var socket = new WebSocket('ws://' + window.location.host);
socket.onopen = function() {
  document.body.className = 'connected';
};
socket.onclose = function() {
  document.body.className = 'disconnected';
};
socket.onmessage = function(evt) {
  var data = JSON.parse(evt.data);
  if (data['event'] == 'end') {
    socket.close();
  } else {
    append(data.data);
  }
};

function append(text) {
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(text))
  document.body.appendChild(li);
}
