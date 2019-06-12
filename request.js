const url = require('url');

module.exports = {

  set url(val) {
    this.req.url = val;
  },

  get url() {
    return this.req.url;
  },

  get query() {
    return url.parse(this.req.url, true).query;
  },

};
