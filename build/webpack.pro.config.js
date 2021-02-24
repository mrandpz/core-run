const { merge } = require("webpack-merge")
const path = require("path")
const baseConfig = require("./webpack.base.config")
const relativeRootPath = place => path.join(__dirname,'..',place)
module.exports = merge(baseConfig,{
	mode: "production",
	output: {
		path: relativeRootPath('dist'),
		publicPath: '/',
		filename:'[name].[chunkhash:8].js'
	},
})