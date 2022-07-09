const HtmlWebPackPlugin = require( 'html-webpack-plugin' )
const path = require( 'path' )
const Dotenv = require('dotenv-webpack')

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: './src/index.js',
    devServer: {
        static: './dist',
        hot: true,
        compress: true,
        port: 7071,
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'main.js',
        publicPath: '/',
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
            {
            test: /\.js$/,
            use: 'babel-loader',
            },
            {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
            test: /\.(png|j?g|svg|gif)?$/,
            use: 'file-loader'
            }
    ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve( __dirname, 'public/index.html' ),
            filename: 'index.html'
        }),
        new Dotenv()
    ]
    }
