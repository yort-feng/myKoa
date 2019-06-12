module.exports = {
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

};
