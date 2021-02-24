const webpack = require("webpack")
const ESLintPlugin = require('eslint-webpack-plugin')
const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.base.config")

module.exports = merge(baseConfig,{
	mode: "development",
	entry: ["webpack/hot/dev-server"],
	plugins: [
		new ESLintPlugin({
			extensions: ["tsx"]
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		overlay: {
			warnings: true,
			errors: true
		},
		hot: true,
		historyApiFallback: true,
		compress: true,
		proxy: {
			"/api": {
					target: "http://localhost:3000/",
					secure: false,
					changeOrigin: true,
					pathRewrite: { '^/api' : '' },
			},
		},
	}
})