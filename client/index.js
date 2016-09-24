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
  } else if (data.type == 'html') {
    appendHtml(data.data);
  } else {
    appendText(data.data);
  }
};

function appendHtml(html) {
  var li = document.createElement('li');
  li.innerHTML = html;
  document.body.appendChild(li);
}

function appendText(text) {
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(text))
  document.body.appendChild(li);
}
