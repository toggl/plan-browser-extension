import _ from 'lodash';
import Promise from 'bluebird';
import superagent from 'superagent';
import * as api from './api';
import config from './config';

const stash = {
  loaded: false,
  data: null,
};

export function getStash() {
  const request = superagent.get(`${config.api.host}/stash/v2/`);

  request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);

  return createRequestPromise(request, getStash).then(updateStash);
}

function triggerAchievement(achievementId) {
  function achievementFn() {
    return getStash().then(() => {
      const { data } = stash;
      const achievedAchievements = _.get(
        data,
        'data.achievements.achievedAchievements',
        []
      );
      const externalAchievements = _.get(
        data,
        'data.achievements.externalAchievements',
        []
      );
      const isAchieved = achievedAchievements.indexOf(achievementId) !== -1;
      const isRegistered = externalAchievements.indexOf(achievementId) !== -1;

      if (!isAchieved && !isRegistered) {
        const request = superagent.post(`${config.api.host}/stash/v2/`);

        request.send(
          _.merge(data, {
            achievements: _.merge({}, _.get(data, 'achievements', {}), {
              externalAchievements: _.concat(
                _.get(data, 'achievements.externalAchievements', []),
                [achievementId]
              ),
            }),
          })
        );

        request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);

        return createRequestPromise(request, achievementFn).then(updateStash);
      } else {
        return Promise.resolve(stash.data);
      }
    });
  }

  return achievementFn;
}

function updateStash(updatedStash) {
  stash.loaded = true;
  stash.data = updatedStash;
}

function createRequestPromise(request, requestBuilder) {
  return new Promise((resolve, reject) => {
    request.end((error, response) => {
      if (!response) {
        return reject({ message: 'network_error', error });
      } else if (response.unauthorized) {
        return api.auth.refreshTokens().then(
          () => requestBuilder(),
          error => reject(error)
        );
      } else if (response.ok) {
        return resolve(response.body);
      } else {
        return reject({ message: 'unknown_error' });
      }
    });
  });
}

export const triggerAchievementUseButton = triggerAchievement('use_tw_button');
