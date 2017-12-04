# ykit-config-es6

## Features

- 编译 ES6+代码（兼容至 IE8）
- 通过 happypack 提升编译速度
- 添加 babel-polyfill

## 安装

在项目中执行：

```
$ npm install ykit-config-es6 --save
```

编辑 `ykit.js`，引入插件即可：

```
module.exports = {
    plugins: ['es6']
    // ...
};
```

## babel-polyfill

babel-polyfill 默认是没有引入的，需要根据项目需求手动引入。

### 功能

babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign ）都不会转码。如果需要这些 API 则要手动引入 babel-polyfill。

### 引入

引入 babel-polyfill 需要在入口 js 头部，加入如下一行代码：

```javasciprt
import 'babel-polyfill';
```

<b class="ykit-tip">
babel-polyfill 会增大 js 体积（压缩后 80k 左右），请根据项目需求选择是否引入。
</b>

## 配置项

### ie8 支持

如果要支持 ie8 请传入配置项：

```javascript
module.exports = {
    plugins: [
        {
            name: 'es6',
            options: {
                ie8: true
            }
        }
    ]
};
```

### 更改 ES6 编译配置

该插件支持更改 babel-loader 的 `test`、`exclude`、`query` 配置项：

```javascript
module.exports = {
    plugins: [
        'qunar', {
            // 通过对象的方式引入插件，可以传入 options
            name: 'es6',
            options: {
                // 更改 es6 配置
                test: /\.(js)$/, // 默认是 /\.(js|jsx)$/
                exclude: /node_modules\/(?!(MY_UI)\/).*/, // 默认是 /node_modules/
                modifyQuery: function(defaultQuery) { // 可查看和编辑 defaultQuery
                    defaultQuery.presets.push('my_preset');
                    defaultQuery.plugins.push('my_plugin');
                    return defaultQuery;
                }
            }
        }
    ],
    config: {
        // ...
    }
};
```

**注意：更改 bebal-loader 配置后有可能不会立即生效，此时需要清除一下缓存，重新安装 node_modules 即可。**

### 禁用严格模式

Babel 会默认为 JS 文件添加严格模式，如果想要禁用它可以传入 removeStrict 参数

```javascript
module.exports = {
    plugins: [
        {
            name: 'es6',
            options: {
                removeStrict: true
            }
        }
    ]
};
```
