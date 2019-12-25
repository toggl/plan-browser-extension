import TaskModel from 'src/models/task_model';
import analytics from 'src/utils/analytics';
import { openPopupWindow } from 'src/background/util/popup_window';

chrome.contextMenus.create({
  id: 'context-add',
  title: 'Add to Toggl Plan',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(function(info) {
  const model = new TaskModel({ name: info.selectionText });
  const params = model.serialize();

  chrome.windows.getCurrent(function(current) {
    openPopupWindow({
      params,
      anchor: 'window',
      window: {
        width: current.width,
        height: current.height,
        x: current.left,
        y: current.top,
      },
    });
  });

  analytics.track('context', 'click');
});
