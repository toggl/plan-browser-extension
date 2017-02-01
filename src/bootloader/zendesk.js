'use strict';

const moment = require('moment');
const twb = require('../utils/content');

twb.observe('section.ticket', (section) => {
  let title = section.querySelector('input[name=subject]').value;

  let button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });

  let container = section.querySelector('footer > .pane');
  let previous = container.querySelector('.post-save-actions');
  twb.insert(button, previous);

  return button;
}, (button) => {
  twb.remove(button);
});
