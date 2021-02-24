const { merge } = require("webpack-merge")

const baseConfig = require("./webpack.base.config")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig,{
    mode: "production",
    plugins: [
        new BundleAnalyzerPlugin()
    ]
})