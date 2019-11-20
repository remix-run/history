import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

import { name } from './package.json';

const external = id => !id.startsWith('.') && !id.startsWith('/');

const esm = [
  {
    input: 'modules/index.js',
    output: { file: `esm/${name}.js`, format: 'esm' },
    external,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      })
    ]
  },
  {
    input: 'modules/index.js',
    output: { file: `esm/${name}.min.js`, format: 'esm' },
    external,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS'
      }),
      terser()
    ]
  }
];

const umd = [
  {
    input: 'modules/index.js',
    output: { file: `umd/${name}.js`, format: 'umd', name: 'HistoryLib' },
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  {
    input: 'modules/index.js',
    output: { file: `umd/${name}.min.js`, format: 'umd', name: 'HistoryLib' },
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS'
      }),
      terser()
    ]
  }
];

let config = esm.concat(umd);

export default config;
