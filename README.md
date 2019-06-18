# myKoa
I'm gonna create a simple web frame, help us understand Koa2 better. It's based on https://github.com/mly-zju/blog/issues/9 and koa's source code.
# Features
* HTTP Server
* Context
* Middlewares
* Handle Errors
# Implement Steps
## Build HTTP Server
* create Application class
* create listen function
```
  listen(...args) {
    const app = http.createServer(this.callback());
    app.listen(...args);
  }
```
* create callback function
```
  callback() {
    return (req, res) => {
      this.callbackFn(req, res);
    };
  }
```
* add example for testing
```
const MyKoa = require('./application');

const app = new MyKoa();

app.use((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('sucessed');
});
app.listen(8000, () => {
  console.log('Application is running and listening to 8000');
});
```
* test example
- `node example.js`
- input url `localhost:8000` in browser and shows `succeed`
## Create context
* create request.js only support query's setter and getter
```
  get query() {
    return url.parse(this.req.url, true).query;
  },
```
* create response.js only support body's and statusCode's setter and getter
```
  set body(data) {
    // eslint-disable-next-line no-underscore-dangle
    this._body = data;
  },
  get body() {
    // eslint-disable-next-line no-underscore-dangle
    return this._body;
  },
  set status(statusCode) {
    this.res.statusCode = statusCode;
  },

  get status() {
    return this.res.statusCode;
  },
```
* create context.js delegates all access of request.js and response.js 
```
  const delegate = require('delegates');

  const proto = {};

  delegate(proto, 'request')
    .access('query');
    delegate(proto, 'response')
    .access('body')
    .access('statusCode');

  module.exports = proto;
```
* add example2 for testing
```
  app.use(async (ctx) => {
    ctx.body = `Hello ${ctx.query.name}, welcome!`;
  });
  app.listen(8000, () => {
    console.log('Application is running and listening to 8000');
  });
```
## Support middlewares
* add middlewares array to Application's construct
```
  constructor() {
    super();
    this.middlewares = [];
    ...
  }
  use(fn) {
    this.middlewares.push(fn);
  }
```
* add compose function to conbine all middlewares, make it executing as m1(ctx, () => m2(ctx, () => m3(ctx, ...)))
```
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
```
* add example3 for testing
## Handle Errors
* add onerror event in context
```
const proto = 

  onerror(err) {
    const { res } = this;
    if (err.code === 'EONENT') err.status = 404;
    if (typeof err.status !== 'number') err.status = 500;
    // delegate
    this.app.emit('error', err);
    this.status = err.status;
    const msg = err.message || 'Intenal Error.';
    res.end(msg);
  },

}
```
* refacte Application's callback
```
      const onerror = err => ctx.onerror(err);
      fnMiddleware(ctx).then(handleResponse).catch(onerror);
```
* add example4 for testing