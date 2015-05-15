var request = require('superagent');
var Promise = require('promise');

var TokensModel = require('../models/tokens_model');

var state = {
  tokens: new TokensModel({
    app_id: 'teamweek_timeline',
    app_secret: 'b8bfafcc06bbe59fbeab4cc6f071fda4'
  })
};

exports.initialize = function() {
  return Promise.all([
    state.tokens.fetch()
  ]);
};

exports.getTokens = function() {
  return state.tokens;
}

exports.isAuthenticated = function() {
  return state.tokens.has_auth_tokens;
};

exports.authenticate = function(credentials) {
  return state.tokens.authenticate(credentials);
};
