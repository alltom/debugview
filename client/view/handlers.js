var d3 = require('d3');

var handlers = {};

handlers.raw = function(logItem, env) {
  env.appendText(logItem.data);
};

handlers.html = function(logItem, env) {
  env.appendHtml(logItem.data);
};

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

var svg = null, barData = [], nextBarId = 0;
handlers.bar = function(logItem, env) {
  if (!logItem.data.label) {
    logItem.data.label = String(nextBarId++);
  }
  barData.push(logItem.data);

  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: Math.min(
        d3.max(barData, function(d) { return 8 + d.label.length * 6 }), 400)
  };

  if (svg == null) {
    svg = d3.select(document.body)
              .append('svg')
              .attr('width', 960)
              .attr('height', 200);
    var g = svg.append('g');
  }

  svg.attr('height', barData.length * 15 + margin.top + margin.bottom);
  var width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom;

  var x = d3.scaleLinear().rangeRound([0, width]),
      y = d3.scaleBand().rangeRound([0, height]).padding(0.1);

  var g = svg.select('g');
  g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var data = barData;

  x.domain([0, d3.max(data, function(d) { return d.value; })]);
  y.domain(data.map(function(d) { return d.label; }));

  g.selectAll('g.axis').remove();
  g.append('g').attr('class', 'axis axis--x').call(d3.axisTop(x));
  g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('value');

  var bar = g.selectAll('.bar').data(data, function(d) { return d.label; });
  bar.exit().remove();
  bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return x(0); })
      .attr('y', function(d) { return y(d.label); })
      .attr('height', y.bandwidth())
      .attr('width', function(d) { return x(d.value); });
  bar.attr('x', function(d) {
       return x(0);
     }).attr('y', function(d) {
         return y(d.label);
       }).attr('height', y.bandwidth()).attr('width', function(d) {
    return x(d.value);
  });
};

module.exports = function(logItem, env) {
  if (logItem.type in handlers) {
    handlers[logItem.type](logItem, env);
  } else {
    env.appendError('unsupported log item type: ' + logItem.type);
  }
};
