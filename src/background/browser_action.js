import config from 'src/api/config';
import { addOnExtensionClickListener, createURL } from './util';

addOnExtensionClickListener(function() {
  chrome.windows.getCurrent({}, win => {
    chrome.windows.create({
      url: createURL({ name: '' }),
      width: config.popup.width,
      height: config.popup.height,
      top: 120,
      left: win.width - config.popup.width - 20,
      type: 'popup',
    });
  });
});
