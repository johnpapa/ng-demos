'use strict';
var nodemon = require('../lib');

nodemon({
  script: './args.js',
  args: ['a', 'b'],
  verbose: true
}).on('log', function (event) {
  console.log(event.colour);
});