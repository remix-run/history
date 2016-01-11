var spawn = require('child_process').spawn
var stat = require('fs').stat

stat('lib', function (error, stat) {
  if (error || !stat.isDirectory())
    spawn('npm', ['run', 'build'], { stdio: 'inherit' })
})
