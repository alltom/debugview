var handlers = [];

handlers.push({
  matcher: /^html (.+)/,
  handler: function(match) { return [{type: 'html', data: match[1]}]; }
});

handlers.push({
  matcher: /^tr (.+)/,
  handler: function(match) {
    return [{type: 'table', data: {type: 'row', cells: match[1].split(/\|/g)}}];
  }
});

handlers.push({
  matcher: /^bar (.+)/,
  handler: function(match) {
    var fields = match[1].trim().split(/ /);
    var label = '', value;
    if (fields.length == 1) {
      value = parseFloat(fields[0]);
    } else {
      label = fields[0];
      value = parseFloat(fields[1]);
    }
    return [{type: 'bar', data: {label: label, value: value}}];
  }
});

// Given a line, returns an array of {type: string, data: string}.
module.exports = function(line) {
  var lineString = line.toString('utf8');
  var match = /^<<<(.*)>>>$/.exec(lineString);
  if (match) {
    for (var i = 0; i < handlers.length; i++) {
      var handler = handlers[i];
      var match2 = handler.matcher.exec(match[1]);
      if (match2) {
        return handler.handler(match2);
      }
    }
  }
  return [{type: 'raw', data: lineString}];
};
