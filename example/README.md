This folder contains a fully configured Webpack project using `antd-scss-theme-plugin`.
To see the example in action, first clone this repository and navigate to this `example/` folder

```bash
git clone https://github.com/prncc/antd-scss-theme-plugin.git
cd antd-scss-theme-plugin/example
```

Then, install the the example's dependencies

```bash
yarn install
```

Finally, start the development server

```bash
yarn start
```

which will hot-reload the example served at `https://localhost:9003`.

Changing the [src/theme.scss](src/theme.scss) should have an effect on the app's appearance.
Try using SCSS versions of various Ant Design variables (e.g., use `$gold-2` instead of `@gold-2`) in [src/components/App.scss](src/components/App.scss).
