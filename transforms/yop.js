const debug = require('debug')('tilt:app');
const regex = /^[A-Z]/;

// const bel = require('bel').createElement;

let registered = {};
let defaultStore = {};

module.exports = transform;
transform.register = register;

let createElement = (tag, attrs, children) => {
  try {
    return bel(tag, attrs, children);
  } catch (e) {
    console.log('%cERR: %s', 'color: red; font-size: 24px;', e.message);
    console.error('in');
    console.log(children);
    console.log('%cStack: \n' + e.stack, 'color: #a94442;');
  }
};

let transforms = (...plugins) => {
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

    let Constructor = res.attrs.View;
    delete res.attrs.View;

    console.log('create el', res.tag);
    let el = createElement(res.tag, res.attrs, res.children);

    if (Constructor) {
      let view = new Constructor({
        el: el,
        defaults: res.attrs
      });

      debug('Created view', view.el);
      view.update();
      return view.el;
    }

    return el;
  };
};

const yop = require('./transforms/yop');
const yoponent = hx(transforms(yop));

function transform (tag, attrs, children) {
  let custom = regex.test(tag);
  let orig = { tag, attrs, children };

  if (!custom) return orig;

  if (!has(tag)) {
    console.warn('Unknown tag %s', tag);
    return orig;
  }

  debug('Custom tag', tag, attrs, children);
  let Constructor = registered[tag];
  let name = tag.toLowerCase();

  tag = 'div';

  // let store = attrs.store || Object.assign({}, defaultStore);
  // delete attrs.store;

  return {
    tag,
    children,
    attrs: Object.assign({}, attrs, {
      className: `${name}--component`,
      View: Constructor
    })
  };
}

function register (name, Constructor) {
  if (!Constructor) {
    Constructor = name;
    name = null;
  }

  if (!(name || Constructor.name)) {
    throw new Error('Cant determine name, make sure to pass in a valid constructor');
  }

  let custom = regex.test(name);
  if (!custom) throw new Error(name + ' is not a valid name');

  debug('Element name %s', name);
  if (registered[name]) throw new Error('already registered');

  registered[name] = Constructor;
}

function has (name) {
  return !!registered[name];
}
