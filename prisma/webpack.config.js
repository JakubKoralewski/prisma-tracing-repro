const path = require("path")
const nodeExternals = require("webpack-node-externals")
/** @type {import('webpack').Configuration} */
module.exports = {
    mode: "development",
    target: "node",
    entry: "./prisma/seed.js",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "seed.js"
    },
    resolve: {
        modules: ["node_modules", "."]
    },
    externals: [nodeExternals()],
    externalsPresets: { node: true },
}
