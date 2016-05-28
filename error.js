const { format } = require('util');
const { EventEmitter } = require('events');
const debug = require('debug')('error-format');

// todo: test extending directly Error

class ErrorFormat extends EventEmitter {
  constructor (namespace, ...args) {
    super();
    debug('Init error', namespace, args);
    this.ns = namespace;
    this.msg = format(...args);
    this.error = new Error(this.msg);
    debug('msg', this.msg);
  }
}

let error = (ns) => {
  let emitter = new EventEmitter();

  let namespace = (...args) => {
    let err = new ErrorFormat(ns, ...args).error;
    emitter.emit('error', err);
    return err;
  };

  namespace.on = emitter.on.bind(emitter);
  namespace.emit = emitter.emit.bind(emitter);

  namespace.define = (msg) => {
    /* eslint no-return-assign: 0 */
    namespace.on('error', (err) => err.stack = `${msg} ${err.message}`);
  };

  return namespace;
};

error.ErrorFormat = ErrorFormat;
module.exports = error;
