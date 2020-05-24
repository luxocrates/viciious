const path                          = require("path");
const HtmlWebpackPlugin             = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { CleanWebpackPlugin }        = require("clean-webpack-plugin");
const MiniCssExtractPlugin          = require("mini-css-extract-plugin");

module.exports = [

  // Development
  {
    name:    "web-dev",
    target:  "web",
    mode:    "development",
    entry:   "./src/entry/web-dev.js",
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist/web-dev",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title:    "Viciious – dev",
        template: "src/host/webFrontEnd/template.ejs",
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "dist/web-dev"),
    },
  },

  // Distributable single-HTML-file bundle
  {
    name:   "web-prod",
    target: "web",
    mode:   "production",
    entry:  "./src/entry/web-prod.js",
    performance: {
      // This is an app, not a traditional web page. Let's relax the size
      // warnings.
      maxAssetSize:      (2 * 1048576),
      maxEntrypointSize: (2 * 1048576),
    },
    plugins: [
      new CleanWebpackPlugin({
        // We use the HtmlWebpackInlineSourcePlugin to bundle the whole app
        // into the viciious.html file, but webpack will have also emitted the
        // separate JavaScript and CSS files. Delete them.
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ["main.js", "main.css"],
      }),
      new HtmlWebpackPlugin({
        title:        "Viciious",
        inlineSource: "\\.(js|css)$",
        template:     "src/host/webFrontEnd/template.ejs",
        filename:     "viciious.html",
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "dist/web-prod"),
    },
  },

  // A novelty command-line version of the emulator 
  {
    name:   "node-prod",
    target: "node",
    mode:   "production",
    entry:  "./src/entry/node.js",
    plugins: [
      new CleanWebpackPlugin(),
    ],
    output: {
      filename: "viciious.js",
      path: path.resolve(__dirname, "dist/node"),
    },
  },

  // A test executor that runs through the Wolfgang Lorenz test suite
  {
    name:   "test-lorenz",
    target: "node",
    mode:   "production",
    entry:  "./src/entry/test-lorenz.js",
    output: {
      filename: "lorenz.js",
      path: path.resolve(__dirname, "dist/test"),
    },
  },
];
