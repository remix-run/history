const execSync = require('child_process').execSync;
const path = require('path');

function exec(cmd) {
  execSync(cmd, { env: process.env, stdio: 'inherit' });
}

let config = path.resolve(__dirname, 'builds/history.js');

exec(`rollup -c ${config}`);
