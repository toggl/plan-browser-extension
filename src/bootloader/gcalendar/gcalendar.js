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
        start_date: $('input[aria-label="Start date"]').val().trim(),
        end_date: $('input[aria-label="End date"]').val().trim(),
        start_time: $('input[aria-label="Start time"]').val().trim(),
        end_time: $('input[aria-label="End time"]').val().trim()
      };
    }

    const button = twb.create({
      task: { ...{ name: title }, ...date },
      anchor: 'screen',
    });

    const container = $('[aria-label]:last-child', bubble).parent().next()[0];
    twb.append(button, container);

    return button;
  },
  button => {
    twb.remove(button);
  },
  'style'
);

const dddd = /(day|\d{4})$/
const dd = /^\d{1,2}(?!:)/
const mmdd = /^.{3,7} \d{1,2}(?!:)/
const yyyy = /\d{4}$/
const hh = /^\d{1,2}:/
const ampm = /(a|p)m$/

const parseRawDates = raw => {
  const parts = raw
    .split(',')
    .filter(p => !p.match(dddd)) // Remove day of the week
    .join(',')
    .split('–')
    .join('⋅')
    .split('⋅')
    .map(p => p.trim())
    .map(parsePart)

  if (parts.length === 3) {
    parts.shift()
  }

  if (parts.length === 1) {
    parts.push(parts[0])
  }

  return parts.reduce((range, part, i) => {
    const dateTime = part.split(year).filter(p => p.length > 0)
    const key = i === 0 ? 'start' : 'end'
    range[`${key}_date`] = `${dateTime[0]}${year}`;
    range[`${key}_time`] = dateTime.length > 1 ? dateTime[1].replace(',', '').trim() : null;
    return range;
  }, {
    start_date: new Date(),
    end_date: new Date(),
    start_time: null,
    end_time: null,
  })
};

const parsePart = (part, i, parts) => {
  // Add month
  if (dd.test(part) && i === 1) {
    part = `${parts[0].split(' ')[0]} ${part}`;
  }

  // Add year
  part = part.replace(mmdd, `\$&, ${year}\$\``);

  // Add previous date
  if (hh.test(part) && i > 0) {
    const day = parts[0];
    const date = yyyy.test(day) ? day : `${day}, ${year}`;
    let pp = ''

    // Add am/pm
    if (!ampm.test(part) && parts.length > 2) {
      pp = parts[2].match(ampm)[0];
    }

    part = `${date}, ${part}${pp}`;
  }

  return part;
};
