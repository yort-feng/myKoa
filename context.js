const delegate = require('delegates');

const proto = {};

delegate(proto, 'request')
  .access('query');
delegate(proto, 'response')
  .access('body')
  .access('statusCode');

module.exports = proto;
