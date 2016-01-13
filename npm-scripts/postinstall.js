var stat = require('fs').stat

stat('lib', function (error, stat) {
  if (error || !stat.isDirectory()) {
    console.warn(
      '-'.repeat(79) + '\n' +
'Built output not found. It looks like you might be attempting to install\n' +
'history from GitHub. React Router sources need to be transpiled before use. We\n'+
'will now make a best-efforts attempt to transpile the code. This will only work\n' +
'if your development environment is set up appropriately.\n' +
      '-'.repeat(79)
    )

    try {
      var execSync = require('child_process').execSync
      execSync('npm run build', { stdio: [ 0, 1, 2 ] })
    } catch (e) {
      console.error(
        '-'.repeat(79) + '\n' +
'Failed to build history automatically. Please install history from npm, or\n' +
'clone the repo locally and build the library manually.\n' +
        '-'.repeat(79)
      )
      throw(e)
    }
  }
})
