var Promise = require('promise');
var State = require('ampersand-state');
var request = require('superagent');
var url = require('url');

var OAuthState = require('./oauth_state');
var TokensModel = require('./tokens_model');

var AuthenticationState = State.extend({

  props: {
    refresh_promise: 'object'
  },

  children: {
    oauth: OAuthState,
    tokens: TokensModel
  },

  derived: {
    authenticated: {
      deps: ['tokens.has_auth_tokens'],
      fn: function() {
        return this.tokens.has_auth_tokens;
      }
    }
  },

  initialize: function() {
    this.oauth.set({
      id: 'teamweek_timeline',
      secret: 'b8bfafcc06bbe59fbeab4cc6f071fda4'
    });
  },

  load: function() {
    return this.tokens.fetch();
  },

  authenticate: function(credentials) {
    return this.fetchTokens(credentials);
  },

  fetchTokens: function(credentials) {
    var self = this;

    return new Promise(function(resolve, reject) {
      request
        .post('https://teamweek.com/api/v3/authenticate/token')
        .set('Authorization', 'Basic ' + self.oauth.token)
        .type('form').send({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password
        })
        .end(function(error, response) {
          if (response == null) {
            reject({ message: 'network_error' });
          } else if (response.ok) {
            resolve(self.tokens.save(response.body));
          } else if (response.clientError) {
            reject({ message: 'invalid_credentials' });
          } else {
            reject({ message: 'unknown_error' });
          }
        });
    });
  },

  refreshTokens: function() {
    var self = this;

    if (this.refresh_promise == null) {
      this.refresh_promise = new Promise(function(resolve, reject) {
        request
          .post('https://teamweek.com/api/v3/authenticate/token')
          .set('Authorization', 'Basic ' + self.oauth.token)
          .type('form').send({
            refresh_token: self.tokens.refresh_token,
            grant_type: 'refresh_token'
          })
          .end(function(error, response) {
            self.refresh_promise = null;
            
            if (response == null) {
              reject({ message: 'network_error' });
            } else if (response.ok) {
              resolve(self.tokens.save(response.body));
            } else {
              reject({ message: 'unknown_error' });
            }
          });
      });
    }

    return this.refresh_promise;
  }

});

module.exports = AuthenticationState;
