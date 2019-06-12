/* eslint-disable no-use-before-define */
/* eslint-disable no-multi-assign */
const http = require('http');
const EventEmitter = require('events');

const request = require('./request');
const response = require('./response');
const context = require('./context');


module.exports = class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.context = Object.create(context);
  }

  listen(...args) {
    const app = http.createServer(this.callback());
    app.listen(...args);
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res);
      const fnMiddleware = compose(this.middlewares);
      const handleResponse = () => responseBody(ctx);
      const onerror = err => ctx.onerror(err);
      fnMiddleware(ctx).then(handleResponse).catch(onerror);
    };
  }

  createContext(req, res) {
    const ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.app = ctx.request.app = response.app = this;
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
};

/**
 * Response helper.
 */
function responseBody(ctx) {
  const data = ctx.body;
  if (typeof data === 'string') {
    ctx.res.end(data);
  }
  if (typeof data === 'object') {
    ctx.res.end(JSON.stringify(data));
  }
}
/**
 * `async () => await resolver()` is equals with `Promise.resolve(resolver())`
 */
function compose(middlewares) {
  return async (ctx, next) => {
    return dispatch(0);
    function dispatch(idx) {
      let fn;
      if (idx === middlewares.length) {
        fn = next;
      } else {
        fn = middlewares[idx];
      }
      if (!fn) return Promise.resolve();
      // return Promise.resolve(m1(ctx, () => Promise.resolve(m2(ctx, ...))))
      return Promise.resolve(fn(ctx, () => dispatch(idx + 1)));
    }
  };
}
