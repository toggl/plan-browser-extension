'use strict';

const moment = require('moment');
const twb = require('../utils/content');

twb.observe('section.ticket', (section) => {
  let title = section.querySelector('input[name=subject]');

  let button = twb.create({
    task: function() {
      return {
        name: title.value,
      };
    },
    anchor: 'screen'
  });

  let container = section.querySelector('footer > .pane');
  let previous = container.querySelector('.post-save-actions');
  twb.insert(button, previous);

  return button;
}, (button) => {
  twb.remove(button);
});
