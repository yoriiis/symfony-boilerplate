const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ChunksWebpackPlugin = require('chunks-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production'

	return {
		watch: !isProduction,
		entry: {
			home: './front/home/config.js'
		},
		watchOptions: {
			ignored: /node_modules/
		},
		devtool: !isProduction ? 'inline-source-map' : 'none',
		output: {
			path: path.resolve(__dirname, './public/build/assets/'),
			publicPath: '/build/assets/',
			filename: '[name].js',
			sourceMapFilename: '[file].map'
		},
		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					include: path.resolve(__dirname, './front'),
					use: [
						{
							loader: 'babel-loader'
						}
					]
				},
				{
					test: /\.css$/,
					include: [path.resolve(__dirname, './front')],
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader'
						},
						{
							loader: 'postcss-loader',
							options: {
								config: {
									path: path.resolve(__dirname, './')
								}
							}
						}
					]
				},
				{
					test: /\.(jpe?g|png|gif|svg|ico)$/i,
					include: path.resolve(__dirname, './front/'),
					exclude: /(node_modules)/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'images/[name].[ext]'
							}
						}
					]
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js', '.css'],
			alias: {
				shared: path.resolve(__dirname, './front/shared')
			}
		},
		plugins: [
			new ProgressBarPlugin(),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[name].css'
			}),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new ChunksWebpackPlugin({
				outputPath: path.resolve(__dirname, './public/build/templates'),
				fileExtension: '.html.twig',
				templateStyle: '<link rel="stylesheet" href="{{chunk}}" />',
				templateScript: '<script defer src="{{chunk}}"></script>'
			}),
			new ManifestPlugin({
				writeToFileEmit: true,
				fileName: 'manifest.json'
			})
		],
		stats: {
			assets: true,
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false,
			children: false,
			entrypoints: false,
			excludeAssets: /.map$/,
			assetsSort: '!size'
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					cache: true,
					parallel: true,
					sourceMap: false,
					terserOptions: {
						extractComments: 'all',
						compress: {
							drop_console: false
						},
						mangle: true
					}
				}),
				new OptimizeCSSAssetsPlugin({})
			],
			namedModules: true,
			removeAvailableModules: true,
			removeEmptyChunks: true,
			mergeDuplicateChunks: true,
			occurrenceOrder: true,
			providedExports: false,
			splitChunks: true
		}
	}
}
