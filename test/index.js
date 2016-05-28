const transforms = require('..');
const hyperx     = require('hyperx');
const assert     = require('assert');
const error      = require('../error')('test');

error.define('Init');

var plugins = ['./transforms/log', './transforms/yop'];

error.define('Render');
let hx = transforms(require('bel').createElement, plugins);
let tree = hx`
<div>
  <h1>${plugins.join(' ')}</h1>
</div>
`;

assert.ok(tree);

error.define('Virtual DOM');
let stringify          = require('vdom-to-html');
let vdom               = require('virtual-dom');

let dom = transforms(vdom.h, plugins);
hx = hyperx(dom);
tree = hx`
<div>
  <h1>${plugins.join(' ')}</h1>
</div>
`;

let html = stringify(tree);
console.log(html);

assert.ok(typeof html === 'string');
assert.ok(/<div>/.test(html));
assert.ok(/<h1>/.test(html));
assert.ok(/<\/div>/.test(html));

console.log('ok');
