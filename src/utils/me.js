const Promise = require('bluebird');
const config = require('../api/config');
const sync = require('../api/api_sync');
const storage = require('./storage');

const fetchPreferences = () => new Promise((resolve, reject) => {
  const opts = {
    url: `${config.api.host}/api/v3/me`,
    error: reject,
    success: resolve
  };

  sync('read', {}, opts);
});

module.exports = () => new Promise((resolve, reject) =>
  storage
    .get('me')
    .then(({me}) => {
      if (me) {
        return resolve(me);
      }

      fetchPreferences()
        .then(data => {
          me = data;
          return storage.set({me});
        }, reject)
        .then(() => resolve(me), reject);
    }, reject)
);

module.exports.set = exports.set = data => new Promise((resolve, reject) =>
  storage
    .get('me')
    .then(({me}) => {
      me = Object.assign({}, me, data);
      return storage.set({me});
    }, reject)
);

module.exports.clear = exports.clear = () => storage.remove('me');
