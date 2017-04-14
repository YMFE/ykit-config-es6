# ykit-config-es6

## Features

- 编译 ES6+, JSX 代码（兼容至 IE8）
- 通过 happypack 提升编译速度
- 添加 babel-polyfill

## 安装

在项目中执行：

```
$ npm install ykit-config-es6 --save
```

编辑 `ykit.js`，引入插件：

```
module.exports = {
    plugins: ['es6']
    // ...
};
```

## babel-polyfill

babel-polyfill 默认是没有引入的，需要根据项目需求手动引入。

### 功能

babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign ）都不会转码。

### 引入

引入 babel-polyfill 需要在入口 js 头部，加入如下一行代码：

```javasciprt
import 'babel-polyfill';
```

<b class="ykit-tip">
babel-polyfill 会增大 js 体积（压缩后 80k 左右），请根据项目需求选择是否引入。
</b>

## 如何更改配置？

由于插件内置 `happypack`，因此该它的编译 es6 配置需要调用 `modifyHappypack` 接口：

```javascript
module.exports = {
    plugins: [
        'qunar', {
            // 通过对象的方式引入插件，可以传入 options
            name: 'es6',
            options: {
                // 更改 es6 配置
                modifyHappypack: function(config) {
                    // 通过 console.log(config) 可查看当前配置
                    config.verbose = false;
                    return config;
                }
            }
        }
    ],
    config: {
        // ...
    }
};
```

## 插件配置详情（仅供参考）

```javascript
{
    module: {
        loaders: baseConfig.module.loaders.concat([{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loaders: ['happypack/loader']
        }])
    },
    plugins: baseConfig.plugins.concat([
        new HappyPack({
            loaders: [
                {
                    loader: require.resolve('babel-loader'),
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: true,
                        presets: [
                            'es2015',
                            'es2017',
                            'stage-0',
                            'stage-1',
                            'stage-2',
                        ],
                        plugins: ['transform-es2015-modules-simple-commonjs']
                    }
                }
            ],
            threads: 4,
            verbose: false,
            cacheContext: {
                env: process.env.NODE_ENV
            },
            tempDir: path.join(cwd, 'node_modules/.happypack'),
            cachePath: path.join(cwd, 'node_modules/.happypack/cache--[id].json')
        })
    ])
}
```
