'use strict';
var cp = require('child_process');

var child = cp.spawn('node', ['./die.js']);

var ctr = 0;

setInterval(function () {
  console.log('ok: ' + (++ctr));
}, 1000);

child.stdout.on('data', function (data) {
  process.stdout.write(data);
});
child.stderr.on('data', function (data) {
  console.log('stderr');
  process.stderr.write(data);
});

process.on('SIGINT', function () {
  child.on('exit', function () {
    console.log('THE CHILD HAS LEFT THE BUILDING');
    process.exit(0);
  });

  console.log('sending SIGINT');
  child.kill('SIGINT');
  console.log('done');
});