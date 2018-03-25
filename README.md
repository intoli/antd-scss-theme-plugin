`antd-scss-theme-plugin` is a [Webpack plugin](https://webpack.js.org/concepts/plugins/) which allows you to effectively use [Ant Design](https://ant.design/) in a project with SCSS styling.
It makes it possible to:

1. Use an SCSS theme file (like `theme.scss`, for example) to customize Ant Design's theme.
2. Have access to every Ant Design [color](https://github.com/ant-design/ant-design/blob/master/components/style/color/colors.less) and [theme](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) variable in your SCSS by importing the theme with a line like `@import 'theme.scss';`.
3. Live-reload updated Ant Design components when `theme.scss` changes.


## Installation

This plugin is published as [antd-scss-theme-plugin]() on npm:

```bash
npm install --save-dev antd-scss-theme-plugin
```

It extends the functionality of a `antd`, `less-loader` and `sass-loader` to accomplish its goals.
These are listed as `peerDependencies` in [package.json](package.json), and you can install them with:

```
npm install --save antd
npm install --save-dev less-loader sass-loader
```


## Configuration and Usage

To use `antd-scss-theme-plugin`, you need to configure Ant Design to use Less stylesheets when loading components, and connect a few loaders with the plugin in your Webpack setup.
You can find a fully configured project in the [example/](example/) directory.


### Step 1. Configure Ant Design to Use Less Stylesheets

In order to customize Ant Design components, you need to configure `antd` to load its components with Less stylesheets instead of with pre-compiled CSS.
The [official documentation](https://ant.design/docs/react/customize-theme) explains this to some degree, but here are the explicit steps you should take.

1. Install `babel-plugin-import`, a package published by the makers of `antd`.
2. Modify the plugin section of your Babel setup to use this package with `antd`:

    ```json
    "plugins": [
      ["import", {
        "libraryName": "antd",
        "style": true
      }]
    ]
    ```

    The `"style": true` option is what enables the use of Less components.
3. Configure `less-loader` to compile `antd` components.
    This can be done by adding something like the following to your Webpack config's `loaders` array:

    ```javascript
    {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
          },
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: process.env.NODE_ENV !== 'production',
          },
        },
        'less-loader',
      ],
    }
    ```

    Obviously, this also requires you to install `style-loader` and `css-loader`.

With that setup, you can import self-contained `antd` components with lines like  the following in your JavaScript:

```javascript
import { Button } from 'antd';
```

So, in addition to enabling styling customizations, this has the potential to reduce the size of your Webpack bundle.


### Step 2. Use `antd-scss-theme-plugin` in Your Webpack Setup

First, initialize the plugin by passing your theme file's path to the constructor, and add it to your Webpack config's `plugins` array:

```javascript
import AntdScssThemePlugin from 'antd-scss-theme-plugin';

const webpackConfig =  {
  // ...
  plugins: [
    new AntdScssThemePlugin('./theme.scss'),
  ],
};
```

Second, wrap your `less-loader` and `sass-loader` Webpack configs with `AntdScssThemeFile.themify()`.
For example, in the config from Step 1, you would change the line

```javascript
'less-loader',
```

to

```javascript
AntdScssThemePlugin('less-loader'),
```

This works even when your loader has options, e.g., you would change

```javascript
{
  loader: 'sass-loader',
  options: {
    sourceMap: !isProduction,
  },
}
```

to

```javascript
AntdScssThemePlugin.themify({
  loader: 'sass-loader',
  options: {
    sourceMap: !isProduction,
  },
})
```
