var Promise = require('promise');
var State = require('ampersand-state');
var request = require('superagent');
var url = require('url');

var config = require('../api/config');
var OAuthState = require('./oauth_state');
var TokensModel = require('./tokens_model');

var AuthenticationState = State.extend({

  props: {
    // Property for storing the promise during a token refresh
    refresh_promise: 'object'
  },

  children: {
    // State for storing client ID and secret
    oauth: OAuthState,
    // Model for storing access and refresh tokens
    tokens: TokensModel
  },

  derived: {
    // Proxy for the tokens.has_auth_tokens property
    authenticated: {
      deps: ['tokens.has_auth_tokens'],
      fn: function() {
        return this.tokens.has_auth_tokens;
      }
    }
  },

  initialize: function() {
    // Initialize client ID and secret
    this.oauth.set({
      id: '9c782f95e771811bdedb77dc12e6be98ca286ea8',
      secret: '441a5bc3e3828910866ea5929fc0313e63a71a77934f3e248a4322f830253c2164e4cd33bead4e3397a27e2b9863ba4a'
    });
  },

  /**
   * Load all data that is needed for authentication. Should be called
   * when the application starts.
   *
   * @return Promise
   */
  load: function() {
    return this.tokens.fetch();
  },

  /**
   * Fetch tokens from the server using given credentials
   *
   * @param credentials Object with username and password keys
   * @return Promise
   */
  authenticate: function(credentials) {
    return this.fetchTokens(credentials);
  },

  /**
   * Fetch tokens from the server using given credentials
   *
   * @param credentials Object with username and password keys
   * @return Promise
   */
  fetchTokens: function(credentials) {
    var self = this;

    return new Promise(function(resolve, reject) {
      // Create a request that will return access and refresh tokens
      request
        .post(config.api.host + '/api/v3/authenticate/token')
        // Use base64'd client ID and secret for authorization
        .set('Authorization', 'Basic ' + self.oauth.token)
        // Send credentials in form data
        .type('form').send({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password
        })
        // Send the request
        .end(function(error, response) {
          // If there is no response, we assume that the network is down
          if (response == null) {
            reject({ message: 'network_error' });

          // If everything is fine, we save the tokens to local storage
          } else if (response.ok) {
            resolve(self.tokens.save(response.body));

          // If the credentials are invalid, return an error
          } else if (response.clientError) {
            reject({ message: 'invalid_credentials' });

          // If something weird happens, return an error
          } else {
            reject({ message: 'unknown_error' });
          }
        });
    });
  },

  /**
   * Fetch new access and refresh tokens using the current refresh token
   *
   * @return Promise
   */
  refreshTokens: function() {
    var self = this;

    // Check if the tokens are not being refreshed already
    if (this.refresh_promise == null) {
      this.refresh_promise = new Promise(function(resolve, reject) {
        // Create a request that will fetch new tokens
        request
          .post(config.api.host + '/api/v3/authenticate/token')
          // Use base64'd client ID and secret for authorization
          .set('Authorization', 'Basic ' + self.oauth.token)
          // Send refresh token in form data
          .type('form').send({
            refresh_token: self.tokens.refresh_token,
            grant_type: 'refresh_token'
          })
          .end(function(error, response) {
            // Refresh is finished, another can start
            self.refresh_promise = null;
            
            // If there is no response, we assume that the network is down
            if (response == null) {
              reject({ message: 'network_error' });

            // If everything is fine, we save the tokens to local storage
            } else if (response.ok) {
              var result = self.tokens.set(response.body).save();
              resolve(result);
            // If the refresh token is invalid, we clear tokens, remove them
            // from local storage and return an error
            } else if (response.clientError) {
              // tokens.destroy() will return a resolved promise, so we need to
              // reject it with the refresh denied error
              var result = self.tokens.clear().destroy().then(function() {
                return Promise.reject({ message: 'refresh_denied' });
              });

              // if the result promise is rejected, this promise will be rejected too
              resolve(result);

            // If something weird happens, return an error
            } else {
              reject({ message: 'unknown_error' });
            }
          });
      });
    }

    // Return a new or existing refresh promise
    return this.refresh_promise;
  }

});

module.exports = AuthenticationState;
