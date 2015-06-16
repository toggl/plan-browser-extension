chrome.contextMenus.create({
  id: 'context-add',
  title: 'Add to Teamweek',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.executeScript(tab.id, { file: 'scripts/content_context.js' });
});
