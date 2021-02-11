const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const dev = process.env.NODE_ENV === "dev"

///////////////////////////
/// Loaders CSS et SCSS ///
///////////////////////////

let cssLoaders = [
    dev ? 'style-loader' : {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: ''
        }
    },
    'css-loader',
]

if (!dev) {
    cssLoaders.push({
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                    [
                        "autoprefixer",
                        {
                            browsers: ['last 2 versions', 'ie > 8']
                        }
                    ]
                ],
            }
        },
    })
}

////////////////////////
/// OBJET DE CONFIG ///
///////////////////////

let config = {
    mode: dev ? "development" : "production",
    entry: {
        main: ['./assets/css/style.scss', './assets/js/main.js'],
    },
    output: {
        path: path.resolve('./dist'),
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: ''
    },
    devServer: {
        overlay: true,
    },
    resolve: {
        alias: {
            '@': path.resolve('./assets'),
            '@css': path.resolve('./assets/css'),
            '@html': path.resolve('./assets/html'),
            '@js': path.resolve('./assets/js'),
        },
        // POUR REACT
        extensions: ['.js'],
    },
    watch: dev,
    devtool: dev ? "eval-cheap-module-source-map" : false,
    optimization: {
        minimizer: []
    },
    module: {
        rules: [
            {
                test: /.(js)$/, 
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: cssLoaders,
            },
            {
                test: /\.scss$/,
                use: [
                    ...cssLoaders,
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:7].[ext]'
                        },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev,
                        },
                    }
                ],
            },

        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new ESLintPlugin({
            failOnError: !dev,
        }),
    ]
}

if (!dev) {
    config.optimization.minimizer.push(new UglifyJsPlugin())
    config.plugins.push(new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
    }))
}


/////////////////////////////////////////////////////////
/// HTML DYNAMIQUEMENT LINKE AUX ENTRY (.JS et .SCSS) ///
/////////////////////////////////////////////////////////
/// But: Générer tous les html avec les modules d'entry linkés dynamiquement, à partir du dossier assets/html 

const glob = require('glob') 

const files = glob.sync(process.cwd() + '/assets/html/*.html')


files.forEach(file => {

    const chunk = ['main']

    config.plugins.push(
        new HtmlWebpackPlugin({
            template: file,
            filename: path.basename(file), 
            chunks: chunk,
        })
    )
})

module.exports = config

