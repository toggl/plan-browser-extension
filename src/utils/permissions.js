import Promise from 'bluebird';

export const request = function(permissions, domain) {
  return new Promise(function(resolve, reject) {
    chrome.permissions.request(
      {
        permissions,
        origins: ['http://' + domain + '/*', 'https://' + domain + '/*'],
      },
      function(granted) {
        if (granted) {
          resolve();
        } else {
          reject(chrome.runtime.lastError);
        }
      }
    );
  });
};

export const contains = function(domain) {
  return new Promise(function(resolve) {
    chrome.permissions.contains(
      {
        origins: ['http://' + domain + '/', 'https://' + domain + '/'],
      },
      resolve
    );
  });
};

export const remove = function(domain) {
  return new Promise(function(resolve, reject) {
    chrome.permissions.remove(
      {
        origins: ['http://' + domain + '/', 'https://' + domain + '/'],
      },
      function(removed) {
        if (removed) {
          resolve();
        } else {
          reject(chrome.runtime.lastError);
        }
      }
    );
  });
};
