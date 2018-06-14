'use strict';

const path = require('path');
const HappyPack = require('happypack');

exports.config = function (opts, cwd) {
    const babelLoaderOptions = {
        "cacheDirectory": true,
        "presets": [
            [
                "env", {
                    "modules": false,
                    "targets": {
                        browsers: [
                            "> 1%",
                            "last 3 versions",
                            "ios 8",
                            "android 4.2",
                            opts.ie8 ? "ie 8" : "ie 9"
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
    };

    const baseConfig = this.config,
        testReg = opts.test ? opts.test : /\.jsx?$/,
        exclude = opts.exclude ? opts.exclude : /node_modules/,
        options = opts.modifyQuery ? opts.modifyQuery(babelLoaderOptions) : babelLoaderOptions,
        happyPackConfig = {
            id: 'es6',
            loaders: [{
                loader: 'babel-loader',
                test: testReg,
                exclude: exclude,
                options: options
            }],
            threads: 4,
            verbose: false,
        };

    baseConfig.module.rules.push({
        test: testReg,
        exclude: exclude,
        use: ['happypack/loader?id=es6']
    });

    baseConfig.plugins.push(new HappyPack(happyPackConfig));

    if (options.removeStrict) {
        baseConfig.module.rules.push({
            test: /\.js$/,
            enforce: 'post',
            loader: path.join(__dirname, 'remove-strict-loader.js')
        });
    }

    return babelLoaderOptions;
};