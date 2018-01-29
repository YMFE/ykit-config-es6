'use strict';

var path = require('path');
var HappyPack = require('happypack');

exports.config = function (options, cwd) {
    var isWebpack2 = this.webpack.version && this.webpack.version >= 2;
    var babelQuery = {
        "cacheDirectory": true,
        "presets": [
            [
                "env", {
                    "modules": isWebpack2 ? false : "commonjs",
                    "targets": {
                        browsers: [
                            "> 1%",
                            "last 3 versions",
                            "ios 8",
                            "android 4.2",
                            options.ie8 ? "ie 8" : "ie 9"
                        ]
                    },
                    "useBuiltIns": "usage"
                }
            ]
        ],
        "plugins": [
            "transform-decorators-legacy", // mobx 要求这个插件必须在最前
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-object-assign",
            "transform-function-bind"
        ]
    }

    var baseConfig = this.config,
        testReg = options.test ? options.test : /\.(js|jsx)$/,
        exclude = options.exclude ? options.exclude : /node_modules/,
        query = options.modifyQuery ? options.modifyQuery(babelQuery) : babelQuery,
        happyPackConfig = {
            loaders: [
                {
                    loader: 'babel-loader',
                    test: testReg,
                    exclude: exclude,
                    query: query
                }
            ],
            threads: 4,
            verbose: false,
            cacheContext: {
                env: process.env.NODE_ENV
            },
            tempDir: path.join(__dirname, '../happypack'),
            cachePath: path.join(__dirname, '../happypack/cache--[id].json')
        };

    happyPackConfig = options.modifyHappypack ? options.modifyHappypack(happyPackConfig) : happyPackConfig;

    extend(true, baseConfig, {
        module: {
            loaders: baseConfig.module.loaders.concat([{
                test: testReg,
                exclude: exclude,
                loader: 'happypack/loader'
            }])
        },
        plugins: baseConfig.plugins.concat([
            new HappyPack(happyPackConfig)
        ])
    });

    if(options.removeStrict) {
        var postLoaders = baseConfig.module.postLoaders ? baseConfig.module.postLoaders : [];
        postLoaders.push(
            {
                test: /\.js$/,
                loader: path.join(__dirname, 'remove-strict-loader.js')
            }
        )
    }

    return babelQuery;
};
