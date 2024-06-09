const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        static: './dist',
        hot: true,
        compress: true
    },
    resolve: {
        fallback: {
            path: require.resolve("path-browserify"),
            os: require.resolve("path-browserify"),
            crypto: require.resolve("path-browserify")
        }
  }
})