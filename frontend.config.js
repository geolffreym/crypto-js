require("dotenv").config();

const Dotenv = require('dotenv-webpack');
const path = require("path");
const webpack = require("webpack");
const Settings = require("./package.json");

module.exports = function (env) {
    //Handle environment
    const ENV = `development` in env && `development` || `production`;
    process.env[`NODE_ENV`] = ENV;

    //Default plugin for usage
    let defaultPlugin = [
        new Dotenv(),
        new webpack.ProvidePlugin(Settings.manifest.plugins),
    ];

    return {
        mode: ENV,
        entry: {'index': './frontend/index.js'},
        output: {
            path: path.resolve(__dirname, './frontend/dist'),
            filename: '[name].bundle.js'
        },
        watchOptions: {
            ignored: /node_modules/,
            poll: 200 // Check for changes every second
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: `babel-loader`,
                    options: {
                        sourceType: 'unambiguous',
                        presets: [['@babel/preset-env', {
                            "useBuiltIns": "usage",
                            "corejs": 3,
                        }]],
                        plugins: [
                            ['@babel/plugin-transform-runtime', {
                                "regenerator": true
                            }]
                        ]
                    }
                },
            ]
        },
        plugins: defaultPlugin,
    };
};
