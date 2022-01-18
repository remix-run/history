import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const PRETTY = !!process.env.PRETTY;
const SOURCE_DIR = 'packages/history';
const OUTPUT_DIR = 'build/history';

const modules = [
  {
    input: `${SOURCE_DIR}/index.ts`,
    output: {
      file: `${OUTPUT_DIR}/index.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx']
      }),
      copy({
        targets: [
          { src: 'README.md', dest: OUTPUT_DIR },
          { src: 'LICENSE', dest: OUTPUT_DIR },
          { src: `${SOURCE_DIR}/package.json`, dest: OUTPUT_DIR }
        ],
        verbose: true
      })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  ...['browser', 'hash'].map((env) => {
    return {
      input: `${SOURCE_DIR}/${env}.ts`,
      output: {
        file: `${OUTPUT_DIR}/${env}.js`,
        format: 'esm',
        sourcemap: !PRETTY
      },
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: /node_modules/,
          extensions: ['.ts', '.tsx'],
          plugins: ['babel-plugin-dev-expression']
        })
      ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
    };
  })
];

const webModules = [
  {
    input: `${SOURCE_DIR}/index.ts`,
    output: {
      file: `${OUTPUT_DIR}/history.development.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx']
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        preventAssignment: true
      })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: `${SOURCE_DIR}/index.ts`,
    output: {
      file: `${OUTPUT_DIR}/history.production.min.js`,
      format: 'esm',
      sourcemap: !PRETTY
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx']
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      terser({ ecma: 8, safari10: true })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  }
];

const globals = [
  {
    input: `${SOURCE_DIR}/index.ts`,
    output: {
      file: `${OUTPUT_DIR}/umd/history.development.js`,
      format: 'umd',
      sourcemap: !PRETTY,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx'],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        preventAssignment: true
      })
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: `${SOURCE_DIR}/index.ts`,
    output: {
      file: `${OUTPUT_DIR}/umd/history.production.min.js`,
      format: 'umd',
      sourcemap: !PRETTY,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.ts', '.tsx'],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true
      }),
      terser()
    ].concat(PRETTY ? prettier({ parser: 'babel' }) : [])
  }
];

const node = [
  {
    input: `${SOURCE_DIR}/node-main.js`,
    output: {
      file: `${OUTPUT_DIR}/main.js`,
      format: 'cjs',
      exports: 'auto'
    },
    plugins: PRETTY ? prettier({ parser: 'babel' }) : []
  }
];

const config = [...modules, ...webModules, ...globals, ...node];

export default config;
