const qs = require('querystring');

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 400;
const BUTTON_MARGIN = 20;
const BUTTON_SIZE = 20;

function openPopupWindow(data) {
  const position = calculatePosition(data);
  const url = createURL(data.params);

  chrome.windows.create({
    url,
    left: Math.round(position.x),
    top: Math.round(position.y),
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    type: 'popup'
  });
}

function calculatePosition(data) {
  if (data.anchor === 'screen') {
    return {
      x: (data.screen.width - POPUP_WIDTH) / 2,
      y: (data.screen.height - POPUP_HEIGHT) / 2
    };
  } else if (data.anchor === 'element') {
    return {
      x: (data.element.x > (data.screen.width / 2))
        ? data.element.x - POPUP_WIDTH - BUTTON_MARGIN
        : data.element.x + BUTTON_SIZE + BUTTON_MARGIN,
      y: (data.element.y > (data.screen.height / 2))
        ? data.element.y - POPUP_HEIGHT + BUTTON_SIZE
        : data.element.y
    };
  } else if (data.anchor === 'window') {
    return {
      x: data.window.x + (data.window.width - POPUP_WIDTH) / 2,
      y: data.window.y + (data.window.height - POPUP_HEIGHT) / 2
    };
  }
}

function createURL(params) {
  const query = qs.stringify(params);
  return chrome.extension.getURL('popup.html?' + query);
}

exports.open = openPopupWindow;
