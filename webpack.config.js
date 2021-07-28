const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const targetFolderName = 'dist'
const outputPath = path.resolve(__dirname, targetFolderName)
const packageJSON = require('./package.json')


module.exports = {
    mode: 'development',
    entry: {
        app: packageJSON.main
    },
    node: {
        buffer: false,
        setImmediate: false
    },
    devServer: {
        contentBase: outputPath,
        compress: true,
        // handle asset renaming
        before: function(app, server, compiler){
            app.get('/examples/assets/*', (req, res, next)=>{
                if(req.originalUrl.match(/lcjs_example_\d*_\w*-/g)){
                    res.redirect(req.originalUrl.replace(/lcjs_example_\d*_\w*-/g,''))
                }
                else{
                    next()
                }
            })
        }
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules')
        ],
        extensions: ['.js']
    },
    output: {
        filename: 'js/[name].[contenthash].bundle.js',
        chunkFilename: 'js/[name].[contenthash].bundle.js',
        path: outputPath
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                // make separate 'vendor' chunk that contains any depenedencies
                // allows for smaller file sizes and faster builds
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: 'single'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "app",
            filename: path.resolve(__dirname, 'dist', 'index.html')
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './assets/**/*', to: './examples/assets', flatten: true, noErrorOnMissing: true },
                { from: './node_modules/@arction/lcjs/dist/resources', to: 'resources', noErrorOnMissing: true },
            ]
        })
    ]
}
