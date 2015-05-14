var Promise = require('promise');

exports.isAuthenticated = function() {
  return false;
};

exports.authenticate = function(username, password) {
  if (password == 'password') {
    return Promise.resolve();
  } else {
    return Promise.reject({ message: 'Wrong password' });
  }
};

exports.addTask = function(data) {
  if (data.title = 'Teamweek rocks') {
    return Promise.resolve();
  } else {
    return Promise.reject({ message: 'Invalid title' });
  }
};
