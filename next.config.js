/* eslint-disable */

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ANALYZE } = process.env;

const withCss = require("@zeit/next-css");

// fix: prevents error when .css files are required by node
if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

module.exports = withCss({
  webpack: function(config) {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: 8888,
          openAnalyzer: true
        })
      );
    }

    return config;
  }
});
