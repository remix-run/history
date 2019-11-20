import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

import pkg from './package.json';

const input = './modules/index.js';
const globalName = 'History';

function external(id) {
  return !id.startsWith('.') && !id.startsWith('/');
}

const cjs = [
  {
    input,
    output: { file: `cjs/${pkg.name}.js`, format: 'cjs' },
    external,
    plugins: [babel({ exclude: /node_modules/ }), replace({ 'process.env.NODE_ENV': JSON.stringify('development') })],
  },
  {
    input,
    output: { file: `cjs/${pkg.name}.min.js`, format: 'cjs' },
    external,
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
    ],
  },
];

const esm = [
  {
    input,
    output: { file: `esm/${pkg.name}.js`, format: 'esm' },
    external,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
    ],
  },
  {
    input,
    output: { file: `esm/${pkg.name}.min.js`, format: 'esm' },
    external,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
      }),
      terser(),
    ],
  },
];

const umd = [
  {
    input,
    output: { file: `umd/${pkg.name}.js`, format: 'umd', name: globalName },
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    ],
  },
  {
    input,
    output: { file: `umd/${pkg.name}.min.js`, format: 'umd', name: globalName },
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
      }),
      terser(),
    ],
  },
];

let config;
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  case 'umd':
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

export default config;
