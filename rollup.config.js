import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

import { name } from './package.json';

export default [
  {
    input: 'modules/index.js',
    output: {
      file: `build/${name}.development.js`,
      format: 'esm',
      sourcemap: true
    },
    external: ['@babel/runtime/helpers/esm/extends'],
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]]
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
    ]
  },
  {
    input: 'modules/index.js',
    output: {
      file: `build/${name}.production.js`,
      format: 'esm',
      sourcemap: true
    },
    external: ['@babel/runtime/helpers/esm/extends'],
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
  },

  // UMD
  {
    input: 'modules/index.js',
    output: {
      file: `build/umd/${name}.development.js`,
      format: 'umd',
      sourcemap: true,
      name: 'HistoryLibrary'
    },
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
    output: {
      file: `build/umd/${name}.production.js`,
      format: 'umd',
      sourcemap: true,
      name: 'HistoryLibrary'
    },
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
