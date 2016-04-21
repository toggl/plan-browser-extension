'use strict';
const twb = require('../utils/content');

twb.observe('#projects .task', (task) => {
  const title = task.querySelector('h4');

  const button = twb.create({
    task: {name: title.textContent},
    anchor: 'screen'
  });

  const name = task.querySelector('.task-name');
  twb.prepend(button, name);

  return button;
}, (button) => {
  twb.remove(button);
});

twb.observe('#projects .project-summary', (project) => {
  const title = project.querySelector('h3');

  const button = twb.create({
    task: {name: title.textContent},
    anchor: 'screen'
  });

  twb.append(button, project);

  return button;
}, (button) => {
  twb.remove(button);
});
