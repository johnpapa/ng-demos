'use strict';

// process.once('SIGINT', function () {
//   console.log('got a SIGINT');
//   process.exit(0);
// });

var ctr = 0;

setInterval(function () {
  console.log('child: ' + (++ctr));
}, 500);