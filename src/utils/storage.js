const Promise = require('bluebird');

exports.get = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.get(items, resolve);
  });
};

exports.set = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.set(items, resolve);
  });
};

exports.remove = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.remove(items, resolve);
  });
};
