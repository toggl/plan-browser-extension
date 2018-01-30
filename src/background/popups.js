const openPopupWindow = require('./util/popup_window').open;

chrome.runtime.onMessage.addListener(function(data) {
  if (data.type !== 'open_popup') {
    return;
  }
  openPopupWindow(data);
});
