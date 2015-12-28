/**
 * Copyright (c) 2012, Ryuichi Okumura. All rights reserved.
 * Code licensed under the BSD License:
 * https://github.com/okuryu/node-iyql/blob/master/LICENSE.md
 */
'use strict';

var fs = require('fs');
var path = require('path');
var repl = require('repl');
var querystring = require('querystring');
var url = require('url');
var nopt = require('nopt');
var request = require('request');
var knownOptions = {
  endpoint: url,
  env: url,
  help: Boolean,
  ssl: Boolean,
  version: Boolean
};
var shortHands = {
  p: ['--endpoint'],
  e: ['--env'],
  h: ['--help'],
  s: ['--ssl'],
  v: ['--version']
};
var options = nopt(knownOptions, shortHands);

function showHelp() {
  var help = 'Usage: iyql [options]\n' +
    '\n' +
    'Options:\n' +
    '  -p, --endpoint set YQL endpoint URL. default: ' +
    'http://query.yahooapis.com/v1/public/yql\n' +
    '  -e, --env      set YQL env URL\n' +
    '  -h, --help     print help\n' +
    '  -s, --ssl      use HTTPS endpoint\n' +
    '  -v, --version  print version\n';

  process.stdout.write(help);
}

function showVersion() {
  var version = require('../package.json').version;

  process.stdout.write('v' + version + '\n');
}

function replCallback(cmd, context, filename, callback) {
  var endpoint;
  var query = cmd.trim();
  var qs = querystring.stringify({
    diagnostics: 'true',
    debug: 'true',
    env: options.env || 'http://www.datatables.org/alltables.env',
    format: 'json',
    q: query
  });

  if (options.endpoint) {
    endpoint = options.endpoint;
  } else {
    endpoint = options.ssl ? 'https' : 'http';
    endpoint += '://query.yahooapis.com/v1/public/yql';
  }

  request(endpoint + '?' + qs, function (error, response, body) {
    callback(JSON.stringify(JSON.parse(body), null, 2));
  });
}

function main() {
  if (options.help) {
    showHelp();
    process.exit();
  } else if (options.version) {
    showVersion();
    process.exit();
  }

  repl.start({
    prompt: 'iyql> ',
    eval: replCallback,
    ignoreUndefined: true
  });
}

exports.route = function () {
  main();
};
