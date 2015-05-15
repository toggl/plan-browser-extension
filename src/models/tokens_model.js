var Model = require('ampersand-model');
var storage = require('../api/storage');

var TokensState = Model.extend({

  props: {
    app_id: 'string',
    app_secret: 'string',
    access_token: 'string',
    refresh_token: 'string',
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
  }

});

module.exports = TokensState;
