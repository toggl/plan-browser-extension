var Model = require('ampersand-model');
var request = require('superagent');
var storage = require('../api/storage');

var TokensState = Model.extend({

  props: {
    app_id: 'string',
    app_secret: 'string',
    access_token: 'string',
    refresh_token: 'string',
    refresh_promise: 'object'
  },

  derived: {
    app_token: {
      deps: ['app_id', 'app_secret'],
      fn: function() {
        return btoa(this.app_id + ':' + this.app_secret);
      }
    },
    has_auth_tokens: {
      deps: ['access_token', 'refresh_token'],
      fn: function() {
        return this.access_token != null && this.refresh_token != null;
      }
    }
  },

  sync: function(method, model, options) {
    if (method == 'read') {
      return storage.get([
        'access_token', 'refresh_token'
      ]).then(options.success);
    }

    if (method == 'update' || method == 'create') {
      return storage.set({
        access_token: model.access_token,
        refresh_token: model.refresh_token
      }).then(function() {
        options.success();
      });
    }
  },

  authenticate: function(credentials) {
    var self = this;

    return new Promise(function(resolve, reject) {
      request
        .post('https://teamweek.com/api/v3/authenticate/token')
        .set('Authorization', 'Basic ' + self.app_token)
        .type('form').send({
          username: credentials.username,
          password: credentials.password,
          grant_type: 'password'
        })
        .end(function(error, response) {
          if (error != null) {
            reject({ message: 'network_error' });
          } else if (response.ok) {
            resolve(self.save(response.body));
          } else if (response.clientError) {
            reject({ message: 'invalid_credentials' });
          } else {
            reject({ message: 'unknown_error' });
          }
        });
    });
  },

  refresh: function() {
    var self = this;

    if (this.refresh_promise == null) {
      this.refresh_promise = new Promise(function(resolve, reject) {
        request
          .post('https://teamweek.com/api/v3/authenticate/token')
          .set('Authorization', 'Basic ' + self.app_token)
          .type('form').send({
            refresh_token: self.refresh_token,
            grant_type: 'refresh_token'
          })
          .end(function(error, response) {
            self.refresh_promise = null;
            
            if (error != null) {
              reject({ message: 'network_error' });
            } else if (response.ok) {
              resolve(self.save(response.body));
            } else {
              reject({ message: 'unknown_error' });
            }
          });
      });
    }

    return this.refresh_promise;
  }

});

module.exports = TokensState;
