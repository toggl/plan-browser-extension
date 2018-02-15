const Promise = require('bluebird');
const config = require('../api/config');
const sync = require('../api/api_sync');
const storage = require('./storage');

const fetchPreferences = () => new Promise((resolve, reject) => {
  const opts = {
    url: `${config.api.host}/api/v3/me/preferences`,
    error: reject,
    success: resolve
  };

  sync('read', {}, opts);
});

module.exports = () => new Promise((resolve, reject) =>
  storage
    .get('preferences')
    .then(({preferences}) => {
      if (preferences) {
        return resolve(preferences);
      }

      fetchPreferences()
        .then(data => {
          preferences = data;
          return storage.set({preferences});
        }, reject)
        .then(() => resolve(preferences), reject);
    }, reject)
);

module.exports.set = exports.set = data => new Promise((resolve, reject) =>
  storage
    .get('preferences')
    .then(({preferences}) => {
      preferences = Object.assign({}, preferences, data);
      return storage.set({preferences});
    }, reject)
);

module.exports.clear = exports.clear = () => storage.remove('preferences');
