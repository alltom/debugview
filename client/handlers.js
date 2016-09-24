var handlers = {};

var tableElem = null;
handlers.table = function(logItem, env) {
	if (tableElem == null) {
		tableElem = document.createElement('table');
		env.appendElement(tableElem);
	}

	var tr = document.createElement('tr');
	logItem.data.cells.map(makeCell).forEach(function(cell) {
		tr.appendChild(cell);
	});
	tableElem.appendChild(tr);

	function makeCell(text) {
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(text));
		return td;
	}
};

handlers.html = function(logItem, env) {
  env.appendHtml(logItem.data);
};

handlers.raw = function(logItem, env) {
  env.appendText(logItem.data);
};

module.exports = function(logItem, env) {
  if (logItem.type in handlers) {
    handlers[logItem.type](logItem, env);
  } else {
    env.appendError('unsupported log item type: ' + logItem.type);
  }
};
