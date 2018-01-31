const Model = require('ampersand-model');
const storage = require('../utils/storage');

/** Model for storing OAuth access and refresh tokens in local storage */
const TokensModel = Model.extend({
  props: {
    /** ID, is always "tokens" **/
    id: ['string', true, 'tokens'],
    /** Access token */
    access_token: 'string',
    /** Refresh token */
    refresh_token: 'string'
  },

  derived: {
    /** Whether the access and refresh tokens are set */
    has_auth_tokens: {
      deps: ['access_token', 'refresh_token'],
      fn() {
        return this.access_token && this.refresh_token;
      }
    }
  },

  /**
   * Custom implementation of model sync method that uses Chrome
   * extension local storage.
   *
   * @param method Specifies the action [create, read, update, delete]
   * @param model Model that is the target of the action
   * @param options Options such as success and error handlers
   * @return Promise
   */
  sync(method, model, options) {
    // Fetch the model from local storage
    if (method === 'read') {
      return storage.get(model.id).then(function(data) {
        // Local storage API always returns data as an object
        options.success(data[model.id]);
      });
    }

    if (method === 'update' || method === 'create') {
      const data = {};
      data[model.id] = model.toJSON();

      return storage.set(data).then(function() {
        options.success();
      });
    }

    if (method === 'delete') {
      return storage.remove(model.id).then(function() {
        options.success();
      });
    }
  }
});

module.exports = TokensModel;
