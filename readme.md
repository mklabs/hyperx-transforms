# hyperx-transform

> hyperx middleware like transforms

## Usage

```js
const hyperx     = require('hyperx');
const transforms = require('hyperx-transforms');
const vdom       = require('virtual-dom');
const stringify  = require('vdom-to-html');

const plugins = ['./transforms/log', './transforms/yop'];
hx = hyperx(transforms(vdom.h, plugins);
tree = hx`
<div>
  <h1>${plugins.join(' ')}</h1>
</div>
`;

let html = stringify(tree);
console.log(html);
...
```

## Transforms

Transforms are hyperscript middleware like functions in the form of:

```js
transform(tag, attrs, children) => { tag, attrs, children }
```

Unlike regular hyperscript factories, they don't return an hyperscript renderer
but a `{ tag, attrs, children }` object.

The result can include modified version of the original tag, attrs and children params.

The original tag, attrs and children should remain untouched (no mutation).

Possible use case:

- Have some kind of logic or transformation triggered on specific tags.
- Add, remove properties
- Creates new children, or remove some.
- etc.

## Examples

Run with `node [test](./test/index/js)`

```js
const hyperx     = require('hyperx');
const transforms = require('hyperx-transforms');
const assert     = require('assert');

const plugins = ['./transforms/log', './transforms/yop'];

let hx = transforms(require('bel').createElement, plugins);
let tree = hx`
<div>
  <h1>${plugins.join(' ')}</h1>
</div>
`;

assert.ok(tree);

let vdom      = require('virtual-dom');
let stringify = require('vdom-to-html');

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
```
