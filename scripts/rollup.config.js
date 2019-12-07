import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import copy from 'rollup-plugin-copy';
import nodeResolve from 'rollup-plugin-node-resolve';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const dev = process.env.NODE_ENV === 'development';

const modules = [
  {
    input: 'packages/history/modules/history.js',
    output: {
      file: 'build/history/history.js',
      format: 'esm',
      sourcemap: !dev
    },
    external: ['./browser.js', './hash.js', './memory.js'],
    plugins: [
      babel({ exclude: /node_modules/ }),
      // TODO: Closure Compiler doesn't recognize the `external` config
      // (above) and complains about missing modules. Not a huge deal since
      // the source file is so small, but still it'd be nice to figure out
      // how to do this properly...
      // compiler({
      //   compilation_level: 'SIMPLE_OPTIMIZATIONS'
      //   // This suppresses the error messages but strips the modules
      //   // from the output.
      //   // jscomp_off: ['moduleLoad']
      // })
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
      })
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  },
  ...['browser', 'hash', 'memory'].map(env => {
    return {
      input: `packages/history/modules/${env}.js`,
      output: {
        file: `build/history/${env}.js`,
        format: 'esm',
        sourcemap: !dev
      },
      external: ['@babel/runtime/helpers/esm/extends'],
      plugins: [
        babel({
          exclude: /node_modules/,
          runtimeHelpers: true,
          presets: [['@babel/preset-env', { loose: true }]],
          plugins: [
            'babel-plugin-dev-expression',
            ['@babel/transform-runtime', { useESModules: true }]
          ]
        }),
        nodeResolve(),
        compiler({
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT',
          language_out: 'ECMASCRIPT5_STRICT'
        })
      ].concat(dev ? prettier({ parser: 'babel' }) : [])
    };
  })
];

const node = [
  {
    input: 'packages/history/modules/node.js',
    output: {
      file: 'build/history/index.js',
      format: 'cjs'
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: ['babel-plugin-dev-expression']
      })
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  }
];

const globals = [
  {
    input: 'packages/history/modules/history.js',
    output: {
      file: 'build/history/history.development.js',
      format: 'umd',
      sourcemap: !dev,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      compiler({
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT',
        language_out: 'ECMASCRIPT5_STRICT'
      })
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: 'packages/history/modules/history.js',
    output: {
      file: 'build/history/history.production.min.js',
      format: 'umd',
      sourcemap: !dev,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [['@babel/preset-env', { loose: true }]],
        plugins: ['babel-plugin-dev-expression']
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT',
        language_out: 'ECMASCRIPT5_STRICT'
      }),
      terser()
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  }
];

export default [...modules, ...node, ...globals];
