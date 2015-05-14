var Promise = require('promise');

exports.get = function(key) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, function(items) {
      resolve(items[key]);
    });
  });
};

exports.set = function(key, value) {
  var items = {};
  items[key] = value;

  return new Promise(function(resolve, reject) {
    chrome.storage.local.set(items, resolve);
  });
};
