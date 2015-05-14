var request = require('superagent');
var Promise = require('promise');
var storage = require('./storage');

exports.isAuthenticated = function() {
  return storage.get('access_token')
    .then(function(value) {
      return value != null;
    });
};

exports.authenticate = function(data) {
  return new Promise(function(resolve, reject) {
    request
      .post('https://app.teamweek.com/api/v3/authenticate/token')
      .set('Authorization', 'Basic dGVhbXdlZWtfdGltZWxpbmU6YjhiZmFmY2MwNmJiZTU5ZmJlYWI0Y2M2ZjA3MWZkYTQ=')
      .type('form').send({ username: data.username, password: data.password, grant_type: 'password' })
      .end(function(error, response) {
        if (error != null) {
          reject({ message: 'network_error' });
        } else if (response.ok) {
          storage.set('access_token', response.body.access_token);
          storage.set('refresh_token', response.body.refresh_token);
          resolve();
        } else if (response.clientError) {
          reject({ message: 'invalid_credentials' });
        } else {
          reject({ message: 'unknown_error' });
        }
      });
  });
};

exports.addTask = function(data) {
  if (data.title = 'Teamweek rocks') {
    return Promise.resolve();
  } else {
    return Promise.reject({ message: 'Invalid title' });
  }
};
