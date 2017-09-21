'use strict';

var path = require('path');
var HappyPack = require('happypack');

exports.config = function (options, cwd) {
    var defaultQuery = {};
    var babelPlugins = ['transform-class-properties', 'transform-decorators-legacy'];

    if(options.ie8) {
        babelPlugins.push('transform-es2015-modules-simple-commonjs');
    }

    if(this.webpack.version && this.webpack.version >= 2) {
        defaultQuery = {
            cacheDirectory: true,
            presets: [
                ['es2015', {loose: true, modules: false}],
                'es2017',
                'stage-0'
            ],
            plugins: babelPlugins
        }
    } else {
        defaultQuery = {
            cacheDirectory: true,
            presets: [
                ['es2015', {loose: true, modules: 'commonjs'}],
                'es2017',
                'stage-0'
            ],
            plugins: babelPlugins
        }
    }

    var baseConfig = this.config,
        testReg = options.test ? options.test : /\.(js|jsx)$/,
        exclude = options.exclude ? options.exclude : /node_modules/,
        query = options.modifyQuery ? options.modifyQuery(defaultQuery) : defaultQuery,
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
};
