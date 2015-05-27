var Promise = require('promise');

exports.get = function(items) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(items, resolve);
  });
};

exports.set = function(items) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.set(items, resolve);
  });
};

exports.remove = function(items) {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.remove(items, resolve);
  });
};
