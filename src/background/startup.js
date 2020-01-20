import * as api from 'src/api/api';
import { triggerAchievementUseButton } from 'src/api/stash';

chrome.runtime.onStartup.addListener(function() {
  api.auth.load().then(() => {
    if (api.auth.tokens.access_token) {
      triggerAchievementUseButton();
    }
  });
});
