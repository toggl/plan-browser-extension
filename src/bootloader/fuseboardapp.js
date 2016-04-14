'use strict';
const twb = require('../utils/content');

twb.observe('ul#tasklists ul.tasks li, #deal-list tr .summary, #ticket-list tr .summary, #project-list tr', (bubble) => {
  if (!bubble) return;
  let titleElement = bubble.querySelector("a");
  if(!titleElement) return;
  let title = titleElement.textContent.trim();
  let button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });
  let container = bubble.querySelector('h6');
  twb.prepend(button, container);
  return button;
}, (button) => {
  twb.remove(button);
});

twb.observe('ul.deals li, ul.projects li, ul.tickets li', (bubble) => {
  if (!bubble) return;
  let titleElement = bubble.querySelector(".board-card-title");
  if(!titleElement) return;
  let title = titleElement.textContent.trim();
  let button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });
  let container = bubble.querySelector('.board-snapshot-icons');
  twb.append(button, container);
  return button;
}, (button) => {
  twb.remove(button);
});
