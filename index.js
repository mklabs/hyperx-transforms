const debug = require('debug')('hyperx-transforms');
const error = require('./error')('hyperx-transforms');
const path  = require('path');

module.exports = transforms;

function transforms (renderer, plugins) {
  if (!renderer) throw error('A renderer is required');
  if (typeof renderer !== 'function') throw error('A valid hyperx factory is required');

  let tr = transformer(renderer, plugins);
  return tr;
}

function transformer (renderer, plugins) {
  plugins = plugins.map(requirePlugin);

  return (tag, attrs, children) => {
    let res = plugins
      .map((plugin) => {
        return plugin(tag, attrs, children);
      })
      .reduce((a, b) => {
        a.tag = b.tag;
        a.attrs = Object.assign({}, b.attrs);
        a.children = b.children;
        return a;
      }, {});

    debug('Transformed', res.tag);
    let tree = renderer(res.tag, res.attrs, res.children);
    debug('Rendered', res.tag);
    return tree;
  };
};

function requirePlugin (name) {
  name = path.resolve(name);
  debug('require %s plugin', name);

  try {
    return require(name);
  } catch (e) {
    console.error(e.message);
    console.error('Cannot load %s transform', name);
    console.error(error);
    throw error('Cannot load %s transform', name, e.message);
  }
}
