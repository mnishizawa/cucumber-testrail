// Generated by CoffeeScript 1.11.1
(function() {
  var RequestManager, request;

  request = require('request-promise');

  RequestManager = (function() {
    function RequestManager(opts1) {
      this.opts = opts1 != null ? opts1 : {};
    }

    RequestManager.prototype.send = function(type, arg) {
      var body, opts, req, url;
      url = arg.url, body = arg.body;
      opts = this._generateOpts({
        url: url,
        username: this.opts.username,
        password: this.opts.password,
        body: body
      });
      req = request.get;
      if (type === 'post') {
        req = request.post;
      }
      return req(opts).then(function(resp) {
        return JSON.parse(resp);
      })["catch"](function(err) {
        throw new Error(err);
      });
    };

    RequestManager.prototype._generateOpts = function(arg) {
      var body, password, url, username;
      url = arg.url, body = arg.body, username = arg.username, password = arg.password;
      return {
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        auth: {
          username: username,
          password: password
        }
      };
    };

    return RequestManager;

  })();

  module.exports = RequestManager;

}).call(this);
