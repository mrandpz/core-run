const path = require("path");
// const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const config = require("./config")
const relativeRootPath = place => path.join(__dirname, "..", place);

module.exports = {
    entry: [relativeRootPath("src/index.tsx")],
    output: {
        path: relativeRootPath("dist"),
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            // to array
            "core-fe": relativeRootPath("src/core-fe"),
            type: relativeRootPath("src/type"),
            service: relativeRootPath("src/service"),
            pages: relativeRootPath("src/pages"),
            hooks: relativeRootPath("src/hooks"),
        },
        // modules: ["node_modules"]
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(css|less)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new MiniCssExtractPlugin(),
        // new webpack.DefinePlugin({
        // })
    ],
};
