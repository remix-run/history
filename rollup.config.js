import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { uglify } from 'rollup-plugin-uglify';

const input = './modules/index.js';
const name = 'History';
const babelOptions = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true
}
const commonjsOptions = {
  include: /node_modules/
}

export default [
  {
    input,
    output: { file: 'umd/history.js', format: 'umd', name },
    plugins: [
      babel(babelOptions),
      nodeResolve(),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot()
    ]
  },

  {
    input,
    output: { file: 'umd/history.min.js', format: 'umd', name },
    plugins: [
      babel(babelOptions),
      nodeResolve(),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(),
      uglify()
    ]
  }
]
