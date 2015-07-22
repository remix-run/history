var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var mach = require('mach');

var path = resolve(__dirname, 'index.html');
var app = mach.stack();

app.use(mach.file, __dirname);

// Always serve index.html so clients can use pushState.
app.run(function (conn) {
  conn.html(readFileSync(path));
});

mach.serve(app);
