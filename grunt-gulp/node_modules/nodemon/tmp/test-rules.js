'use strict';

var match = require('../lib/monitor/match'),
    merge = require('../lib/utils/merge'),
    defaults = require('../lib/config/defaults'),
    script = process.argv[2];

if (!script) {
  console.log('Usage\n  cat <sample-config.json> | node test-rules.js <file-trigger-change>');
  process.exit(1);
}

process.stdin.resume();
process.stdin.on('data', function (data) {
  var config = JSON.parse(data);

  var settings = merge(config, defaults);

  settings.monitor = match.rulesToMonitor(settings.watch, settings.ignore, { dirs: [] });

  var matched = match([script], settings.monitor, settings.ext.replace(' ', ','));
  console.log('Restart? ' + !!matched.result.length);
  console.log(settings);
  console.log(matched);
});