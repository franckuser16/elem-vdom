var webpack = require('webpack');

var preLoaders = [];

var devOnlyPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    '__DEV__': process.env.NODE_ENV === 'production' ? false : true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV === 'lint') {
  preLoaders.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader'
  });
} else if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
} else {
  plugins = devOnlyPlugins.concat(plugins);
}

module.exports = {
  output: {
    path: './dist/',
    publicPath: '/assets/',
    filename: '[name].js',
    library: 'Elem',
    libraryTarget: 'umd'
  },
  entry: {
    'elem': ['./src/main.js'],
    'sink': ['./examples/sink/main.js']
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    preLoaders: preLoaders,
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?stage=0&optional=runtime'
      }
    ]
  },
  plugins: plugins
};
