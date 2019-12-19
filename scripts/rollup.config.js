import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import copy from 'rollup-plugin-copy';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const pretty = !!process.env.PRETTY;

const modules = [
  {
    input: 'packages/history/modules/index.js',
    output: {
      file: 'build/history/history.js',
      format: 'esm',
      sourcemap: !pretty
    },
    external: ['@babel/runtime/helpers/esm/extends'],
    plugins: [
      copy({
        targets: [
          {
            src: 'packages/history/package.json',
            dest: 'build/history'
          },
          {
            src: 'README.md',
            dest: 'build/history'
          },
          {
            src: 'LICENSE',
            dest: 'build/history'
          }
        ],
        verbose: true
      }),
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: [
          'babel-plugin-dev-expression',
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ],
        runtimeHelpers: true
      }),
      compiler()
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  },
  ...['browser', 'hash', 'memory'].map(env => {
    return {
      input: `packages/history/modules/${env}.js`,
      output: {
        file: `build/history/${env}.js`,
        format: 'esm',
        sourcemap: !pretty
      },
      plugins: [
        babel({
          exclude: /node_modules/,
          presets: [['@babel/preset-env', { loose: true }]]
        }),
        compiler()
      ].concat(pretty ? prettier({ parser: 'babel' }) : [])
    };
  })
];

const webModules = [
  {
    input: 'packages/history/modules/index.js',
    output: {
      file: 'build/history/history.development.js',
      format: 'esm',
      sourcemap: !pretty
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: ['@babel/preset-modules'],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      compiler()
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: 'packages/history/modules/index.js',
    output: {
      file: 'build/history/history.production.min.js',
      format: 'esm',
      sourcemap: !pretty
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
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  }
];

const globals = [
  {
    input: 'packages/history/modules/index.js',
    output: {
      file: 'build/history/umd/history.development.js',
      format: 'umd',
      sourcemap: !pretty,
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
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: 'packages/history/modules/index.js',
    output: {
      file: 'build/history/umd/history.production.min.js',
      format: 'umd',
      sourcemap: !pretty,
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
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  }
];

const node = [
  {
    input: 'packages/history/modules/node-main.js',
    output: {
      file: 'build/history/node-main.js',
      format: 'cjs'
    },
    plugins: [
      compiler()
    ].concat(pretty ? prettier({ parser: 'babel' }) : [])
  }
];

export default [...modules, ...webModules, ...globals, ...node];
