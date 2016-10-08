var path = require('path');

module.exports = {
  entry: {
    view: path.join(__dirname, 'client', 'view', 'index.js'),
    remote: path.join(__dirname, 'client', 'remote', 'index.js'),
  },
  output: {path: __dirname, filename: '[name].bundle.js'},
  module: {loaders: [{test: /\.css$/, loader: 'style!css'}]}
};
