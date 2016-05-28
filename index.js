
const bel = require('bel');
const hyperx = require('hyperx');
const assert = require('assert');

module.exports = transforms;


function transforms(plugins) {
  plugins = plugins.map(requirePlugin);
  return function() {}
}

function requirePlugin() {

}

var factory = transforms(['foo', 'bar']);
assert.ok(typeof factory === 'function');

console.log('ok');
