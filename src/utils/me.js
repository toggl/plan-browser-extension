import Promise from 'bluebird';
import config from 'src/api/config';
import sync from 'src/api/api_sync';
import * as storage from 'src/utils/storage';
import find from 'lodash.find';
import { triggerAchievementUseButton } from 'src/api/stash';
import { presetColors } from 'src/models/color_collection';
import accounts from 'src/models/account_collection';

const fetch = () =>
  new Promise((resolve, reject) => {
    const opts = {
      url: `${config.api.host}/api/v6-rc1/me`,
      error: reject,
      success: resolve,
    };

    sync('read', {}, opts);
  });

export default () =>
  new Promise((resolve, reject) =>
    storage.get('me').then(({ me }) => {
      fetch()
        .then(data => {
          data.workspaces = data.workspaces || data.accounts;
          data.workspaces = data.workspaces.filter(({ active }) => active);
          data.workspaces.forEach(w => {
            w.colors = [...presetColors, ...w.custom_colors];
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

export const set = data =>
  new Promise((resolve, reject) =>
    storage.get('me').then(({ me }) => {
      me = { ...me, ...data };
      return storage.set({ me });
    }, reject)
  );

export const saveSelectedAccount = async id => {
  const { me } = await storage.get('me');
  me.preferences.selected_account_id = id;
  const account = accounts.get(id);
  account.colors.updateRules();
  return await storage.set({ me });
};

export const clear = () => storage.remove('me');
