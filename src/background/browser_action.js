import config from 'src/api/config';
import {
  addExtensionRemovedListener,
  addOnExtensionClickListener,
  createURL,
} from './util';

let windowId = null;

addOnExtensionClickListener(win => {
  if (windowId === null) {
    chrome.windows.create(
      {
        url: createURL({ name: '' }),
        width: config.popup.width,
        height: config.popup.height,
        top: 120,
        left: win.width - config.popup.width - 20,
        type: 'popup',
      },
      win => {
        windowId = win.id;
      }
    );
  } else {
    chrome.windows.update(windowId, { focused: true });
  }
});

addExtensionRemovedListener(winId => {
  if (windowId === winId) {
    windowId = null;
  }
});
