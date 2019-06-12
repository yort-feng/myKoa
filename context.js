/* eslint-disable no-param-reassign */
const delegate = require('delegates');

const proto = {

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

};

delegate(proto, 'request')
  .access('query');
delegate(proto, 'response')
  .access('body')
  .access('statusCode');

module.exports = proto;
