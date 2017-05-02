'use strict';

var sha1 = require('hash.js').sha1;
var global = require('global');

global.__reglContextStore = {};

function getContextPool (hash) {
  var pool = global.__reglContextStore[hash];
  if (!pool) {
    global.__reglContextStore = {};
  }
}

function acquire () {
  var pool = getContextPool();
}

function release () {
}

module.exports = function (config) {
  var hashData = {
    attributes: config.attributes,
    extensions: config.extensions,
    pixelRatio: config.pixelRatio
  };

  var configHash = sha1().update(JSON.stringify(hashData)).digest('hex');

};
