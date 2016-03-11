'use strict';
const twb = require('../utils/content');

twb.observe('.task-gantt-item', (bubble) => {
  if (!bubble) return;
  let titleElement = bubble.querySelector('.task-gantt-item-name');
  if(!titleElement) return;
  let title = titleElement.textContent;
  let button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });
  let container = bubble.querySelector('.task-gantt-item-actions');
  twb.prepend(button, container);
  return button;

}, (button) => {
  twb.remove(button);
});
