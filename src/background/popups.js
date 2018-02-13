const {
  POPUP_WIDTH,
  POPUP_HEIGHT,
  open: openPopupWindow
} = require('./util/popup_window');

chrome.runtime.onMessage.addListener(function(data) {
  if (data.type !== 'open_popup') {
    return;
  }
  openPopupWindow(data);
});

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
