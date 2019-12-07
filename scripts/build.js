const execSync = require('child_process').execSync;
const path = require('path');

function exec(cmd) {
  execSync(cmd, { env: process.env, stdio: 'inherit' });
}

let rollupConfig = path.resolve(__dirname, 'rollup.config.js');

exec(`rollup -c ${rollupConfig}`);
