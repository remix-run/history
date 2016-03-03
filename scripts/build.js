const readFileSync = require('fs').readFileSync
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command) =>
  execSync(command, { stdio: 'inherit' })

exec('npm run build-cjs')
exec('npm run build-es6')
exec('npm run build-umd')
exec('npm run build-min')

console.log(
  '\ngzipped, the UMD build is ' + prettyBytes(
    gzipSize.sync(readFileSync('umd/History.min.js'))
  )
)
