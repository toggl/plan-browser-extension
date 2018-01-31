const moment = require('moment');
const twb = require('../utils/content');

twb.observe('.eb-root', (bubble) => {
  const title = bubble.querySelector('.eb-title').textContent;
  const dates = parseRawDates(bubble.querySelector('.eb-date').textContent);

  const button = twb.create({
    task: Object.assign({name: title}, dates),
    anchor: 'screen'
  });

  const container = bubble.querySelector('.eb-actions-right');
  twb.prepend(button, container);

  return button;
}, (button) => {
  twb.remove(button);
});

const parseRawDates = (raw) => {
  const parts = raw.split('–').map(p => p.trim()).map(parseDatePart);

  return {
    start_date: parts[0].date || new Date(),
    end_date: parts[1].date || parts[0].date || new Date(),
    start_time: parts[0].time || null,
    end_time: parts[1].time || null
  };
};

const parseDatePart = (raw) => {
  const parts = raw.split(',').map(p => p.trim());

  if (parts.length === 1) {
    const time = moment(parts[0], ['H:mm', 'ha'], true);

    return {
      date: null,
      time: time.isValid() ? time.format('HH:mm') : null
    };

  } else {
    const date = moment(parts[1], ['MMMM D', 'D MMMM'], true);
    const time = moment(parts[2], ['H:mm', 'ha'], true);

    return {
      date: date.isValid() ? date.toDate() : null,
      time: time.isValid() ? time.format('HH:mm') : null
    };
  }
};
