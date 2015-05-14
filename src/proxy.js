var Promise = require('promise');

exports.call = function(method, data) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage({ method: method, data: data }, function(response) {
      if (response.success) {
        resolve(response.result);
      } else {
        reject(response.error);
      }
    });
  });
};
