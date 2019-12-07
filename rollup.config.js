import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import copy from 'rollup-plugin-copy';
import nodeResolve from 'rollup-plugin-node-resolve';
import prettier from 'rollup-plugin-prettier';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const dev = process.env.NODE_ENV === 'development';

const esm = [
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
          plugins: [['@babel/transform-runtime', { useESModules: true }]]
        }),
        nodeResolve(),
        compiler({
          compilation_level: 'SIMPLE_OPTIMIZATIONS'
        })
      ].concat(dev ? prettier({ parser: 'babel' }) : [])
    };
  })
];

const cjs = [
  {
    input: 'packages/history/modules/node.js',
    output: {
      file: 'build/history/index.js',
      format: 'cjs'
    },
    plugins: [babel({ exclude: /node_modules/ })].concat(
      dev ? prettier({ parser: 'babel' }) : []
    )
  }
];

const umd = [
  {
    input: 'packages/history/modules/history.js',
    output: {
      file: 'build/history/umd/history.development.js',
      format: 'umd',
      sourcemap: !dev,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      compiler({
        compilation_level: 'SIMPLE_OPTIMIZATIONS'
      })
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  },
  {
    input: 'packages/history/modules/history.js',
    output: {
      file: 'build/history/umd/history.production.min.js',
      format: 'umd',
      sourcemap: !dev,
      name: 'HistoryLibrary'
    },
    plugins: [
      babel({ exclude: /node_modules/ }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      compiler({
        compilation_level: 'SIMPLE_OPTIMIZATIONS'
      }),
      terser()
    ].concat(dev ? prettier({ parser: 'babel' }) : [])
  }
];

export default [...esm, ...cjs, ...umd];
