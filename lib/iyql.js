'use strict';

var fs = require('fs'),
  path = require('path'),
  repl = require('repl'),
  querystring = require('querystring'),
  url = require('url'),
  nopt = require('nopt'),
  request = require('request'),
  knownOptions = {
    endpoint: url,
    env: url,
    help: Boolean,
    version: Boolean
  },
  shortHands = {
    p: ['--endpoint'],
    e: ['--env'],
    h: ['--help'],
    v: ['--version']
  },
  options = nopt(knownOptions, shortHands);

function showHelp() {
  var help = 'Usage: iyql [options]\n' +
    '\n' +
    'Options:\n' +
    '  -p, --endpoint set YQL endpoint URL. default: ' +
    'http://query.yahooapis.com/v1/public/yql\n' +
    '  -e, --env      set YQL env URL\n' +
    '  -h, --help     print help\n' +
    '  -v, --version  print version\n';

  process.stdout.write(help);
}

function showVersion() {
  var version = require('../package.json').version;

  process.stdout.write('v' + version + '\n');
}

function replCallback(cmd, context, filename, callback) {
  var endpoint = options.endpoint || 'http://query.yahooapis.com/v1/public/yql',
    query = cmd.slice(1).slice(0, -2),
    qs = querystring.stringify({
      diagnostics: 'true',
      debug: 'true',
      env: options.env || 'http://www.datatables.org/alltables.env',
      format: 'json',
      q: query
    });

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
