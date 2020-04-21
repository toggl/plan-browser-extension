import moment from 'moment';
import * as twb from '../../utils/content';
import '../global.less';
import './gcalendar.less';

const notTogglPseudoClass = ':not(.toggl-plan)';
const popupDialogSelector = 'div[data-chips-dialog="true"]';
const detailContainerSelector = 'div[data-is-create="false"]';
const rootLevelSelectors = [
  `${popupDialogSelector}`,
  `${detailContainerSelector}${notTogglPseudoClass}`,
].join(',');

let year = new Date().getFullYear()

twb.observe(
  rootLevelSelectors,
  bubble => {
    const isPopup = $(popupDialogSelector, bubble.parentElement).length > 0;
    const isDetail =
      $(detailContainerSelector, bubble.parentElement).length > 0;

    let $title, $date, title, date;
    const yearFromURL = window.location.href.match(/\d{4}/)
    year = yearFromURL ? yearFromURL[0] : year

    if (isPopup) {
      $title = $('span[role="heading"', bubble);
      title = $title ? $title.text().trim() : '';

      // Event
      $date = $title
        .parent()
        .parent()
        .find('div:last-child');

      // Task / Reminder
      if ($date.children('span[role="heading"]').length > 0) {
        const parts = []
        $date
          .parent()
          .next()
          .find('div:last-child > div')
          .contents()
          .filter(function() {
            if (this.nodeType === 3) {
              parts.push(this.textContent.trim())
            }
          })
        date = parseRawDates(parts.length > 0 ? parts.join(', ') : '')
      } else {
        date = parseRawDates($date ? $date.text().trim() : '');
      }
    }

    if (isDetail) {
      $title = $('input[data-initial-value]', bubble);
      title = $title ? $title.val().trim() : '';
      date = {
        start_date:
          moment(
            $('input[aria-label="Start date"]')
              .val()
              .trim()
          ) || new Date(),
        end_date:
          moment(
            $('input[aria-label="End date"]')
              .val()
              .trim()
          ) || new Date(),
        start_time:
          moment(
            $('input[aria-label="Start time"]')
              .val()
              .trim()
          ) || null,
        end_time:
          moment(
            $('input[aria-label="End time"]')
              .val()
              .trim()
          ) || null,
      };
    }

    const button = twb.create({
      task: { ...{ name: title }, ...date },
      anchor: 'screen',
    });

    // const container = bubble.querySelector('.eb-actions-right');
    // twb.prepend(button, container);

    return button;
  },
  button => {
    twb.remove(button);
  },
  'style'
);

const parseRawDates = raw => {
  const parts = raw
    .split(',')
    .filter(p => !p.match(/(day|\d{4})$/))
    .join(',')
    .split('–')
    .join('⋅')
    .split('⋅')
    .map(p => p.trim())
    .reduce(parsePart, '')

  return {
    start_date: new Date(),
    end_date: new Date(),
    start_time: null,
    end_time: null,
  };
};

const parsePart = (dateString, part, i, parts) => {
  // Add month
  if (part.match(/^\d{1,2}(?!:)/) && i === 1) {
    part = `${parts[0].split(' ')[0]} ${part}`;
  }
  // Add year
  if (part.match(/^.{3,7} \d{1,2}(?!:)$/)) {
    part = `${part}, ${year}`
  }
  // Add previous date
  if (part.match(/^\d{1,2}:/) && i > 0) {
    const day = parts[0]
    const date = day.match(/\d{4}$/) ? day : `${day}, ${year}`
    part = `${date}, ${part}`
  }
  console.log(part); // eslint-disable-line
};
