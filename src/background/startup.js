const api = require('../api/api');
const { triggerAchievementUseButton } = require('../api/stash');

chrome.runtime.onStartup.addListener(function() {
  api.auth.load().then(() => {
    if (api.auth.tokens.access_token) {
      triggerAchievementUseButton();
    }
  });
});
