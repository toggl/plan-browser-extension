'use strict';

const moment = require('moment');
const twb = require('../utils/content');

twb.observe('.eb-root', (bubble) => {
  let title = bubble.querySelector('.eb-title').textContent;
  let dates = parseRawDates(bubble.querySelector('.eb-date').textContent);

  let button = twb.create({
    task: Object.assign({name: title}, dates),
    anchor: 'screen'
  });

  let container = bubble.querySelector('.eb-actions-right');
  twb.prepend(button, container);

  return button;
}, (button) => {
  twb.remove(button);
});

const parseRawDates = (raw) => {
  let parts = raw.split('–').map(p => p.trim()).map(parseDatePart);

  return {
    start_date: parts[0].date || new Date(),
    end_date: parts[1].date || parts[0].date || new Date(),
    start_time: parts[0].time || null,
    end_time: parts[1].time || null
  };
}

const parseDatePart = (raw) => {
  let parts = raw.split(',').map(p => p.trim());

  if (parts.length == 1) {
    let time = moment(parts[0], ['H:mm', 'ha'], true);

    return {
      date: null,
      time: time.isValid() ? time.format('HH:mm') : null
    };

  } else {
    let date = moment(parts[1], ['MMMM D', 'D MMMM'], true);
    let time = moment(parts[2], ['H:mm', 'ha'], true);

    return {
      date: date.isValid() ? date.toDate() : null,
      time: time.isValid() ? time.format('HH:mm') : null
    };
  }
}
