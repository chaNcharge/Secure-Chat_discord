const path = require('path');
const webpack = require("webpack");
const pkg = require("./package.json");
const pluginConfig = require("./src/config.json");
pluginConfig.version = pkg.version;

const meta = (() => {
    const lines = ["/**"];
    for (const key in pluginConfig) {
        lines.push(` * @${key} ${pluginConfig[key]}`);
    }
    lines.push(" */");
    return lines.join("\n");
})();

module.exports = {
    mode: "development",
    target: "node",
    devtool: false,
    entry: "./src/index.js",
    output: {
        filename: "SecureChat.plugin.js",
        path: path.join(__dirname, "dist"),
        libraryTarget: "commonjs2",
        libraryExport: "default",
        compareBeforeEmit: false
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [{ test: /\.jsx$/, exclude: /node_modules/, use: "babel-loader" }]
    },
    plugins: [
        new webpack.BannerPlugin({ raw: true, banner: meta }),
    ]
};