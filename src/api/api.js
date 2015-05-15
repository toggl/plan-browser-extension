var request = require('superagent');
var Promise = require('promise');

var TokensModel = require('../models/tokens_model');
var AccountCollection = require('../models/account_collection');

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
  return new Promise(function(resolve, reject) {
    request
      .post('https://teamweek.com/api/v3/authenticate/token')
      .set('Authorization', 'Basic ' + state.tokens.app_token)
      .type('form').send({
        username: credentials.username,
        password: credentials.password,
        grant_type: 'password'
      })
      .end(function(error, response) {
        if (error != null) {
          reject({ message: 'network_error' });
        } else if (response.ok) {
          resolve(state.tokens.save(response.body));
        } else if (response.clientError) {
          reject({ message: 'invalid_credentials' });
        } else {
          reject({ message: 'unknown_error' });
        }
      });
  });
};

exports.fetchAccounts = function() {
  var accounts = new AccountCollection();

  return accounts.fetch()
    .then(function() {
      var users = accounts.map(function(account) {
        return account.users.fetch();
      });

      return Promise.all(users);
    })
    .then(function() {
      return accounts;
    });
};

exports.addTask = function(data) {
  if (data.title = 'Teamweek rocks') {
    return Promise.resolve();
  } else {
    return Promise.reject({ message: 'Invalid title' });
  }
};
