import Promise from 'bluebird';

export const get = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.get(items, resolve);
  });
};

export const set = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.set(items, resolve);
  });
};

export const remove = function(items) {
  return new Promise(function(resolve) {
    chrome.storage.local.remove(items, resolve);
  });
};
