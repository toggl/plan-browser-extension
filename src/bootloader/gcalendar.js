'use strict';

const twb = require('../utils/content');

twb.observe('.eb-root', (bubble) => {
  let title = bubble.querySelector('.eb-title').textContent;
  let button = twb.create({task: {name: title}, layout: 'modal'});

  let container = bubble.querySelector('.eb-actions-right');
  twb.prepend(button, container);

  return button;
}, (button) => {
  twb.remove(button);
});