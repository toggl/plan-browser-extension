import moment from 'moment';
import * as twb from '../../utils/content';
import '../global.less';
import './gcalendar.less';

const notTogglPseudoClass = ':not(.toggl-plan)';
const popupDialogSelector = 'div[data-chips-dialog="true"]';
const detailContainerSelector = 'div[data-is-create="false"]';
const rootLevelSelectors = [
  `${popupDialogSelector}`,
  `${detailContainerSelector}${notTogglPseudoClass}`
].join(',');

twb.observe(
  rootLevelSelectors,
  bubble => {
    const isPopup = $(popupDialogSelector, bubble.parentElement).length > 0;
    const isDetail = $(detailContainerSelector, bubble.parentElement).length > 0;


    let $title, $date, title, date;

    if (isPopup) {
      $title = $('span[role="heading"', bubble);
      title = $title ? $title.text().trim() : '';
      $date = $title.parent().parent().find('div:last-child');
      date = parseRawDates($date ? $date.text().trim() : '');
    }

    if (isDetail) {
      $title = $('input[data-initial-value]', bubble);
      title = $title ? $title.val().trim() : '';
      date = {
        start_date: moment($('input[aria-label="Start date"]').val().trim()) || new Date(),
        end_date: moment($('input[aria-label="End date"]').val().trim()) || new Date(),
        start_time: moment($('input[aria-label="Start time"]').val().trim()) || null,
        end_time: moment($('input[aria-label="End time"]').val().trim()) || null,
      }
    }

    console.log(date); // eslint-disable-line

    const button = twb.create({
      task: { ...{ name: title }, ...date },
      anchor: 'screen',
    });

    // const container = bubble.querySelector('.eb-actions-right');
    // twb.prepend(button, container);

    return button;
  },
  button => {
    // twb.remove(button);
  }
);

const parseRawDates = raw => {
  console.log(raw); // eslint-disable-line
  const parts = raw
    .split('–')
    .map(p => p.trim())
    .map(parseDatePart);

  return {
    start_date: parts[0].date || new Date(),
    end_date: parts[1].date || parts[0].date || new Date(),
    start_time: parts[0].time || null,
    end_time: parts[1].time || null,
  };
};

const parseDatePart = raw => {
  const parts = raw.split(',').map(p => p.trim());

  if (parts.length === 1) {
    const time = moment(parts[0], ['H:mm', 'ha'], true);

    return {
      date: null,
      time: time.isValid() ? time.format('HH:mm') : null,
    };
  } else {
    const date = moment(parts[1], ['MMMM D', 'D MMMM'], true);
    const time = moment(parts[2], ['H:mm', 'ha'], true);

    return {
      date: date.isValid() ? date.toDate() : null,
      time: time.isValid() ? time.format('HH:mm') : null,
    };
  }
};
