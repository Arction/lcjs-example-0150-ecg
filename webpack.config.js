const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const targetFolderName = 'dist'
const outputPath = path.resolve(__dirname, targetFolderName)
const packageJSON = require('./package.json')

module.exports = {
    mode: 'development',
    entry: {
        app: packageJSON.main,
    },
    devServer: {
        static: outputPath,
        compress: true,
    },
    resolve: {
        modules: [path.resolve('./src'), path.resolve('./node_modules')],
        extensions: ['.js'],
    },
    output: {
        filename: 'js/[name].[contenthash].bundle.js',
        chunkFilename: 'js/[name].[contenthash].bundle.js',
        path: outputPath,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // make separate 'vendor' chunk that contains any dependencies
                // allows for smaller file sizes and faster builds
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: 'single',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'app',
            filename: path.resolve(__dirname, 'dist', 'index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './assets/**/*',
                    to: `./examples/assets/${packageJSON.lightningChart.eID}/[name][ext]`,
                    noErrorOnMissing: true,
                },
                {
                    from: './node_modules/@lightningchart/lcjs/dist/resources',
                    to: 'resources',
                    noErrorOnMissing: true,
                },
            ],
        }),
        new webpack.DefinePlugin({
            LCJS_LICENSE: "'" + process.env.LCJS_LICENSE + "'",
        }),
    ],
}
