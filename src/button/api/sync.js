var Promise = require('promise');
var result = require('lodash.result');
var superagent = require('superagent');
var api = require('./api');

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
  throw new Error('A "url" property or function must be specified');
};

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
  'create': 'post',
  'update': 'put',
  'patch':  'patch',
  'delete': 'del',
  'read':   'get'
};

function sync(method, model, options) {
  var type = methodMap[method];
  var url = options.url || result(model, 'url') || urlError();
  var request = superagent[type](url);

  if (method == 'create' || method == 'update' || method == 'patch') {
    var data = options.data || options.attrs || model.toJSON(options);
    request.send(data);
  }

  if (api.auth.authenticated) {
    request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);
  }

  return new Promise(function(resolve, reject) {
    request.end(function(error, response) {
      if (response == null) {
        if (options.error) options.error(error);
        reject({ message: 'network_error', error: error });

      } else if (response.unauthorized) {
        var refresh = api.auth.refreshTokens().then(function() {
          return sync(method, model, options);
        }, function(error) {
          if (options.error) options.error(error);
          return Promise.reject(error);
        });

        resolve(refresh);

      } else if (response.ok) {
        if (options.success) options.success(response.body);
        resolve(model);

      } else {
        if (options.error) options.error();
        reject({ message: 'unknown_error' });
      }
    });
  });
};

module.exports = sync;
