import qs from 'querystring';
import config from 'src/api/config';

const POPUP_WIDTH = config.popup.width;
const POPUP_HEIGHT = config.popup.height;
const BUTTON_MARGIN = config.popup.buttonMargin;
const BUTTON_SIZE = config.popup.buttonSize;

export function openPopupWindow(data) {
  const position = calculatePosition(data);
  const url = createURL(data.params);

  chrome.windows.create({
    url,
    left: Math.round(position.x),
    top: Math.round(position.y),
    width: config.popup.width,
    height: config.popup.height,
    type: 'popup',
  });
}

export function getIsManifestV2() {
  return MANIFEST_V2 === 'true' || MANIFEST_V2 === true ? true : false;
}

export function createURL(params = {}) {
  const query = qs.stringify(params);

  return getIsManifestV2()
    ? chrome.extension.getURL('popup.html?' + query)
    : chrome.runtime.getURL('popup.html?' + query);
}

export function addOnExtensionClickListener(callback) {
  if (getIsManifestV2()) {
    chrome.browserAction.onClicked.addListener(callback);
    return;
  }

  chrome.action.onClicked.addListener(callback);
}

export function addExtensionRemovedListener(callback) {
  chrome.windows.onRemoved.addListener(callback);
}

export function executeScript(tabId, file) {
  if (getIsManifestV2()) {
    chrome.tabs.executeScript(tabId, { file });
    return;
  }

  chrome.scripting.executeScript({
    files: [file],
    target: { tabId },
  });
}

export function insertCSS(tabId, file) {
  if (getIsManifestV2()) {
    chrome.tabs.insertCSS(tabId, { file });
    return;
  }

  chrome.scripting.insertCSS({
    files: [file],
    target: { tabId },
  });
}

function calculatePosition(data) {
  if (data.anchor === 'screen') {
    return {
      x: (data.screen.width - POPUP_WIDTH) / 2,
      y: (data.screen.height - POPUP_HEIGHT) / 2,
    };
  } else if (data.anchor === 'element') {
    return {
      x:
        data.element.x > data.screen.width / 2
          ? data.element.x - POPUP_WIDTH - BUTTON_MARGIN
          : data.element.x + BUTTON_SIZE + BUTTON_MARGIN,
      y:
        data.element.y > data.screen.height / 2
          ? data.element.y - POPUP_HEIGHT + BUTTON_SIZE
          : data.element.y,
    };
  } else if (data.anchor === 'window') {
    return {
      x: data.window.x + (data.window.width - POPUP_WIDTH) / 2,
      y: data.window.y + (data.window.height - POPUP_HEIGHT) / 2,
    };
  }
}
