import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import copy from 'rollup-plugin-copy';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const PRETTY = !!process.env.PRETTY;
const SOURCE_DIR = 'packages/history';
const OUTPUT_DIR = 'build/history';

const modules = [
  {
    input: `${SOURCE_DIR}/index.js`,
    output: {
      file: `${OUTPUT_DIR}/history.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    external: ['@babel/runtime/helpers/esm/extends'],
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: [
          'babel-plugin-dev-expression',
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ],
        runtimeHelpers: true
      }),
      compiler(),
      copy({
        targets: [
          { src: `${SOURCE_DIR}/package.json`, dest: OUTPUT_DIR },
          { src: 'README.md', dest: OUTPUT_DIR },
          { src: 'LICENSE', dest: OUTPUT_DIR }
        ],
        verbose: true
      })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  ...['browser', 'hash', 'memory'].map(env => {
    return {
      input: `${SOURCE_DIR}/${env}.js`,
      output: {
        file: `${OUTPUT_DIR}/${env}.js`,
        format: 'esm',
        sourcemap: !PRETTY
      },
      plugins: [
        babel({
          exclude: /node_modules/,
          presets: [['@babel/preset-env', { loose: true }]]
        }),
        compiler()
      ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
    };
  })
];

const webModules = [
  {
    input: `${SOURCE_DIR}/index.js`,
    output: {
      file: `${OUTPUT_DIR}/history.development.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: ['@babel/preset-modules'],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      compiler()
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: `${SOURCE_DIR}/index.js`,
    output: {
      file: `${OUTPUT_DIR}/history.production.min.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: ['@babel/preset-modules'],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler(),
      terser({ ecma: 8, safari10: true })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  }
];

const globals = [
  {
    input: `${SOURCE_DIR}/index.js`,
    output: {
      file: `${OUTPUT_DIR}/umd/history.development.js`,
      format: 'umd',
      sourcemap: !PRETTY,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      compiler()
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: `${SOURCE_DIR}/index.js`,
    output: {
      file: `${OUTPUT_DIR}/umd/history.production.min.js`,
      format: 'umd',
      sourcemap: !PRETTY,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler(),
      terser()
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  }
];

const node = [
  {
    input: `${SOURCE_DIR}/node-main.js`,
    output: {
      file: `${OUTPUT_DIR}/main.js`,
      format: 'cjs'
    },
    plugins: [compiler()].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  }
];

export default [...modules, ...webModules, ...globals, ...node];
