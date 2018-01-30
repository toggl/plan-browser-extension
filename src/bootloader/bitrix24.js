const twb = require('../utils/content');

twb.observe('.task-gantt-item', function(bubble) {
  if (!bubble) {
    return;
  }

  const titleElement = bubble.querySelector('.task-gantt-item-name');
  if (!titleElement) {
    return;
  }

  const title = titleElement.textContent;
  const button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });
  const container = bubble.querySelector('.task-gantt-item-actions');

  twb.prepend(button, container);

  return button;
}, function(button) {
  twb.remove(button);
});

twb.observe('.task-list-item', function(bubble) {
  if (!bubble) {
    return;
  }

  const titleElement = bubble.querySelector('.task-title-info');
  if (!titleElement) {
    return;
  }

  const title = titleElement.textContent;
  const button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });
  const container = bubble.querySelector('.task-title-right-block');

  twb.prepend(button, container);

  return button;
}, function(button) {
  twb.remove(button);
});
