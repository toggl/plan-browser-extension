var permissions = require('../utils/permissions');

function getDomain(url) {
  var anchor = document.createElement('a');
  anchor.href = url;
  return anchor.hostname;
}

chrome.contextMenus.create({
  id: 'context-add',
  title: 'Add to Teamweek',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var domain = getDomain(info.pageUrl);

  permissions.request(['tabs'], domain).then(() => {
    chrome.tabs.insertCSS(tab.id, {file: 'styles/global.css'});
    chrome.tabs.executeScript(tab.id, {file: 'scripts/content_context.js'});
  });
});
