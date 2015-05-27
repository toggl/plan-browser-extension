var Model = require('ampersand-model');
var storage = require('../../utils/storage');

var TokensState = Model.extend({

  props: {
    id: ['string', true, 'tokens'],
    access_token: 'string',
    refresh_token: 'string'
  },

  derived: {
    has_auth_tokens: {
      deps: ['access_token', 'refresh_token'],
      fn: function() {
        return this.access_token != null && this.refresh_token != null;
      }
    }
  },

  sync: function(method, model, options) {
    if (method == 'read') {
      return storage.get(model.id).then(function(data) {
        options.success(data[model.id]);
      });
    }

    if (method == 'update' || method == 'create') {
      var data = {};
      data[model.id] = model.toJSON();

      return storage.set(data).then(function() {
        options.success();
      });
    }

    if (method == 'delete') {
      return storage.remove(model.id).then(function() {
        options.success();
      });
    }
  }

});

module.exports = TokensState;
