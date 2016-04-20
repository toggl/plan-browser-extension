var permissions = require('../utils/permissions');
var TaskModel = require('../models/task_model');
var analytics = require('../utils/analytics');
var openPopupWindow = require('./util/popup_window').open;

chrome.contextMenus.create({
  id: 'context-add',
  title: 'Add to Teamweek',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var model = new TaskModel({name: info.selectionText});
  var params = model.serialize();

  chrome.windows.getCurrent(function(current) {
    openPopupWindow({
      params: params,
      anchor: 'window',
      window: {
        width: current.width,
        height: current.height,
        x: current.left,
        y: current.top
      }
    });
  });

  analytics.track('context', 'click');
});
