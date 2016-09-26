module.exports = {
  entry: {
    view: './client/view/index.js',
    remote: './client/remote/index.js',
  },
  output: {path: __dirname, filename: '[name].bundle.js'},
  module: {loaders: [{test: /\.css$/, loader: 'style!css'}]}
};
