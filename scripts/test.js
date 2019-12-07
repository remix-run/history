const execSync = require('child_process').execSync;
const path = require('path');

function exec(cmd) {
  execSync(cmd, { env: process.env, stdio: 'inherit' });
}

let karmaConfig = path.resolve(__dirname, 'karma.conf.js');

exec(`karma start ${karmaConfig}`);
