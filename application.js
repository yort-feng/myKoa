const http = require('http');
const EventEmitter = require('events');

module.exports = class Application extends EventEmitter {
  listen(...args) {
    const app = http.createServer(this.callback());
    app.listen(...args);
  }

  use(fn) {
    this.callbackFn = fn;
  }

  callback() {
    return this.callbackFn();
  }
};
