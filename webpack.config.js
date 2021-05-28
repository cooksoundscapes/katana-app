var path = require('path');

module.exports = {
  //...
  output: {
     path: path.resolve(__dirname, '.'),
   },
  devServer: {
    contentBase: path.join(__dirname, '.'),
    compress: true,
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  }
};


