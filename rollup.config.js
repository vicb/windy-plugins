import alias from 'rollup-plugin-alias';
import babel from "@rollup/plugin-babel";
import cjs from "rollup-plugin-commonjs";
import html from "rollup-plugin-html";
import less from "rollup-plugin-less-modules";
import minify from "rollup-plugin-babel-minify";
import pkg from "./package.json";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import stripCode from "rollup-plugin-strip-code"
import visualizer from 'rollup-plugin-visualizer';
const fs = require('fs');
const path = require('path');

const prod = !process.env.ROLLUP_WATCH;

export default {
  input: "src/plugin.js",
  output: {
    file: prod ? "dist/plugin.js" : "dev/plugin.js",
    format: "iife",
  },
  plugins: [
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development"),
        PKG_NAME: JSON.stringify(pkg.name),
        PKG_VERSION: JSON.stringify(pkg.version),
        PKG_AUTHOR: JSON.stringify(pkg.author),
        PKG_DESCRIPTION: JSON.stringify(pkg.description),
        PKG_REPO_TYPE: JSON.stringify(pkg.repository.type),
        PKG_REPO_URL: JSON.stringify(pkg.repository.url),
      },
    }),
    prod && stripCode({
      start_comment: 'strip-from-prod',
      end_comment: 'end-strip-from-prod'
    }),
    less({
      minify: prod,
      sourcemap: false,
    }),
    html({
      include: "src/*.html",
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: false,
        minifyJS: true,
      },
    }),
    resolve(),
    alias({
      entries: {
        react: path.resolve(__dirname, 'node_modules/preact/compat/src/index.js'),
        'react-dom': path.resolve(__dirname, 'node_modules/preact/compat/src/index.js'),
        'react-is': path.resolve(__dirname, 'node_modules/preact/compat/src/index.js'),
      }
    }),    
    cjs({
      include: "node_modules/**",
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
      }      
    }),
    !prod &&
      serve({
        contentBase: "dev",
        port: 9999,
        https: {
          key: fs.readFileSync('key.pem'),
          cert: fs.readFileSync('certificate.pem'),
        }
      }),
    babel({
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "last 2 versions and not ie < 20 and > .5%",
          },
        ],
      ],
      plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]],
    }),
    visualizer(),
    prod && minify({
      comments: !prod,
      keepFnName: false,
    }),
  ],
};
