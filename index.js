'use strict';

var path = require('path');
var HappyPack = require('happypack');

exports.config = function (options, cwd) {
    var defaultQuery = {};
    var babelPlugins = [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-object-assign'
    ];

    if(options.ie8) {
        babelPlugins.push('transform-es2015-modules-simple-commonjs');
    }

    var isWebpack2 = this.webpack.version && this.webpack.version >= 2;
    defaultQuery = {
        cacheDirectory: false,
        presets: [
            [
                'env', {
                    modules: isWebpack2 ? false : 'commonjs',
                    targets: {
                        browsers: [
                            '> 1%',
                            'last 3 versions',
                            'ios 8',
                            'android 4.2',
                            options.ie8 ? 'ie 8' : 'ie 9'
                        ]
                    },
                    useBuiltIns: 'usage'
                }
            ]
        ],
        plugins: babelPlugins
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
