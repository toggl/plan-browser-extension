const Promise = require('bluebird');
const config = require('../api/config');
const sync = require('../api/api_sync');
const storage = require('./storage');
const updateCustomColorsCss = require('./custom_colors_css');
const find = require('lodash.find');
const { triggerAchievementUseButton } = require('../api/stash');

const fetch = () =>
  new Promise((resolve, reject) => {
    const opts = {
      url: `${config.api.host}/api/v4/me`,
      error: reject,
      success: resolve,
    };

    sync('read', {}, opts);
  });

module.exports = () =>
  new Promise((resolve, reject) =>
    storage.get('me').then(({ me }) => {
      fetch()
        .then(data => {
          data.workspaces = data.workspaces || data.accounts;
          data.workspaces = data.workspaces.filter(({ active }) => active);
          data.workspaces.forEach(w => {
            w.customColors = w.custom_colors;
            delete w.custom_colors;
          });

          let selectedAccountId = data.preferences.selected_account_id;
          if (me && me.preferences && me.preferences.selected_account_id) {
            selectedAccountId = me.preferences.selected_account_id;
          }

          if (
            !selectedAccountId ||
            !find(data.workspaces, { id: selectedAccountId })
          ) {
            // todo(mitchel): add check for no workspaces
            selectedAccountId = data.workspaces[0].id;
          }

          data.preferences.selected_account_id = selectedAccountId;

          me = data;

          triggerAchievementUseButton();

          return storage.set({ me: data });
        }, reject)
        .then(() => resolve(me), reject);
    }, reject)
  );

module.exports.set = data =>
  new Promise((resolve, reject) =>
    storage.get('me').then(({ me }) => {
      me = Object.assign({}, me, data);
      return storage.set({ me });
    }, reject)
  );

module.exports.saveSelectedAccount = id =>
  new Promise((resolve, reject) =>
    storage.get('me').then(({ me }) => {
      me.preferences.selected_account_id = id;
      updateCustomColorsCss(id);
      return storage.set({ me });
    }, reject)
  );

module.exports.clear = () => storage.remove('me');
