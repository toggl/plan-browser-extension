const {POPUP_WIDTH, POPUP_HEIGHT} = require('./util/popup_window');

chrome.browserAction.onClicked.addListener(function() {
  chrome.windows.getCurrent({}, win => {
      chrome.windows.create({
      url: chrome.extension.getURL('popup.html?name='),
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      top: 120,
      left: win.width - POPUP_WIDTH - 20,
      type: 'popup'
    });
  });
});
