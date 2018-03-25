<h1 vertical-align="middle">antd-scss-theme-plugin
    <a targe="_blank" href="https://twitter.com/home?status=antd-scss-theme-plugin%20%E2%80%93%20A%20Webpack%20plugin%20for%20customizing%20Ant%20Design%20with%20an%20SCSS%20theme%20file.%0A%0Ahttps%3A%2F%2Fgithub.com%2Fprncc%2Fantd-scss-theme-plugin">
        <img height="26px" src="https://simplesharebuttons.com/images/somacro/twitter.png"
            alt="Tweet"></a>
    <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//github.com/prncc/antd-scss-theme-plugin">
        <img height="26px" src="https://simplesharebuttons.com/images/somacro/facebook.png"
            alt="Share on Facebook"></a>
    <a target="_blank" href="http://reddit.com/submit?url=https%3A%2F%2Fgithub.com%2Fprncc%2Fantd-scss-theme-plugin&title=antd-scss-theme-plugin%20%E2%80%93%20A%20Webpack%20plugin%20for%20customizing%20Ant%20Design%20with%20SCSS">
        <img height="26px" src="https://simplesharebuttons.com/images/somacro/reddit.png"
            alt="Share on Reddit"></a>
    <a target="_blank" href="https://news.ycombinator.com/submitlink?u=https://github.com/prncc/antd-scss-theme-plugin&t=antd-scss-theme-plugin%20%E2%80%93%20A%20Webpack%20plugin%20for%20customizing%20Ant%20Design%20with%20SCSS">
        <img height="26px" src="resources/y-combinator.png"
            alt="Share on Hacker News"></a>
</h1>

<p align="left">
    <a href="https://circleci.com/gh/prncc/antd-scss-theme-plugin/tree/master">
        <img src="https://img.shields.io/circleci/project/github/prncc/antd-scss-theme-plugin/master.svg"
            alt="Build Status"></a>
    <a href="https://github.com/prncc/antd-scss-theme-plugin/blob/master/LICENSE.md">
        <img src="https://img.shields.io/npm/l/antd-scss-theme-plugin.svg"
            alt="License"></a>
    <a href="https://pypi.python.org/pypi/exodus-bundler/">
        <img src="https://img.shields.io/npm/v/antd-scss-theme-plugin.svg"
            alt="NPM Version"></a>
</p>

`antd-scss-theme-plugin` is a [Webpack plugin](https://webpack.js.org/concepts/plugins/) which allows you to effectively use [Ant Design](https://ant.design/) in a project with SCSS styling.
It makes it possible to:

1. Use an SCSS theme file (like `theme.scss`, for example) to customize Ant Design's theme.
2. Have access to every Ant Design [color](https://github.com/ant-design/ant-design/blob/master/components/style/color/colors.less) and [theme](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) variable in your SCSS by importing the theme with a line like `@import 'theme.scss';`.
3. Live-reload updated Ant Design components when `theme.scss` changes.


## Installation

This plugin is published as [antd-scss-theme-plugin](https://www.npmjs.com/package/antd-scss-theme-plugin) on npm:

```bash
npm install --save-dev antd-scss-theme-plugin
```

It extends the functionality of a `antd`, `less-loader` and `sass-loader` to accomplish its goals.
These are listed as `peerDependencies` in [package.json](package.json), and you can install them with:

```
npm install --save antd
npm install --save-dev less-loader sass-loader
```


## Configuration

To use `antd-scss-theme-plugin`, you need to configure Ant Design to use Less stylesheets when loading components, and connect a few loaders with the plugin in your Webpack setup.
You can find a fully configured project in the [example](example/) directory.


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
    sourceMap: process.env.NODE_ENV !== 'production',
  },
}
```

to

```javascript
AntdScssThemePlugin.themify({
  loader: 'sass-loader',
  options: {
    sourceMap: process.env.NODE_ENV !== 'production',
  },
})
```


## Usage

### Customize Ant Design's Theme

With the project configured, you can customize Ant Design's theme by specifying Ant Design variables in the theme file (e.g., `theme.scss`) passed to the plugin's constructor.
For example, if `theme.scss` has the following contents:

```scss
$primary-color: #fe8019;
```

then your rendered components will look something like this:

![Components with Primary Color #fe8019](https://raw.githubusercontent.com/prncc/antd-scss-theme-plugin/master/resources/orange-sample.png)

You can customize any Less variable that `antd` uses in this way, just relace the `@` with a `$`, e.g, `@info-color` becomes `$info-color`.


### Use Ant Design's Customized Color and Theme Variables

If you import the `theme.scss` file somewhere in your project, you will have access to all of Ant Design's [color](https://github.com/ant-design/ant-design/blob/master/components/style/color/colors.less) and [theme](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) variables.
Even if you only specify only a subset of variables in `theme.scss`, all of them should be available.
For instance, with `theme.scss` containing only a `$primary-color` definition as above, you would still be able to do something like:

```scss
@import '../theme.scss';

.header {
  color: $blue-10;
}
```


### Live Reload Components when Ant Design Styles Change

Since `antd-scss-theme-plugin` registers the theme file as a watched dependency with Webpack, changes in the theme file will result in recompilations of components that use it.
To learn how to set up your project to use live reloading, see this in action in the working [example](example/).
