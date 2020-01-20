import _ from 'lodash';
import xhr from './xhr';

const stash = {
  loaded: false,
  data: null,
};

const achievementId = 'use_tw_button';

export async function triggerAchievementUseButton() {
  await getStash();

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
    const payload = _.merge(data, {
      achievements: _.merge({}, _.get(data, 'achievements', {}), {
        externalAchievements: _.concat(
          _.get(data, 'achievements.externalAchievements', []),
          [achievementId]
        ),
      }),
    });
    const updatedStash = await xhr('post', '/stash/v2/', payload);
    updateStash(updatedStash);
  }

  return stash.data;
}

export async function getStash() {
  const stash = await xhr('get', '/stash/v2/');
  updateStash(stash);
}

function updateStash(updatedStash) {
  stash.loaded = true;
  stash.data = updatedStash;
}
