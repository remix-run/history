const readFileSync = require('fs').readFileSync
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, env) =>
  execSync(command, { stdio: 'inherit', env })

const webpackEnv = Object.assign({}, process.env, {
  NODE_ENV: 'production'
})

exec('npm run build-cjs')
exec('npm run build-es6')
exec('npm run build-umd', webpackEnv)
exec('npm run build-min', webpackEnv)

console.log(
  '\ngzipped, the UMD build is ' + prettyBytes(
    gzipSize.sync(readFileSync('umd/history.min.js'))
  )
)
