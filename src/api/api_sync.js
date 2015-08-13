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
  // Get the method and URL we will for the request
  var type = methodMap[method];
  var url = options.url || result(model, 'url') || urlError();

  // Create the request using the method and URL
  var request = superagent[type](url);

  // If we need to send some data to server, add them to the request
  if (method == 'create' || method == 'update' || method == 'patch') {
    var data = options.data || options.attrs || model.toJSON(options);
    request.send(data);
  }

  // If the authentication tokens are set, use them
  if (api.auth.authenticated) {
    request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);
  }

  return new Promise(function(resolve, reject) {
    // Send the request
    request.end(function(error, response) {
      // If there is no response, we can assume the connection is down
      if (response == null) {
        if (options.error) options.error(error);
        reject({ message: 'network_error', error: error });

      // If the server wants us to authorize, we refresh the tokens
      // If the tokens are not set, the refresh will fail
      } else if (response.unauthorized) {
        // Refresh the tokens
        var refresh = api.auth.refreshTokens().then(function() {
          // If it is successful, try sending the sync request again
          return sync(method, model, options);
        }, function(error) {
          // If it fails, call the error handler and pass the error along
          if (options.error) options.error(error);
          return Promise.reject(error);
        });

        // Resolve with a promise, so if the promise fails, this promise fails too
        resolve(refresh);

      // If everything is fine, call success handler and resolve with the model instance
      } else if (response.ok) {
        if (options.success) options.success(response.body);
        resolve(model);

      // If something weird happens, just say it is an unknown error
      } else {
        if (options.error) options.error();
        reject({ message: 'unknown_error' });
      }
    });
  });
};

module.exports = sync;
