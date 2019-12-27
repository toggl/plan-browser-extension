import moment from 'moment';
import HashMap from 'hashmap';
import AmpersandView from 'ampersand-view';
import ButtonState from '../../button/button.js';
import * as observer from 'src/utils/observer';
import { generateTaskNotes } from '../../utils/quill';
import template from './trello.hbs';
import '../global.less';
import './trello.less';

const TrelloButtonView = AmpersandView.extend({
  template,

  props: {
    hub: 'state',
  },

  events: {
    click: 'onClick',
  },

  render() {
    this.renderWithTemplate();
    return this;
  },

  onClick(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  },
});

const buttons = new HashMap();

function createObserver() {
  observer
    .create('.card-detail-window')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(meta) {
  const m = meta.split(' at ');
  if (!m.length) {
    return;
  }

  let date = m[0];
  if (!date) {
    return;
  }
  const time = m[1];
  let dt = moment().startOf('day');

  switch (date) {
    case 'today':
      break;
    case 'yesterday':
      dt = dt.add(-1, 'days');
      break;
    case 'tomorrow':
      dt = dt.add(1, 'days');
      break;
    default:
      if (!/\w{4}$/.test(date)) {
        date += ` ${moment().format('YYYY')}`;
      }
      dt = moment(date);
  }

  const tm = /^(\d{1,2}):(\d{1,2})\s/.exec(time);

  if (tm) {
    dt.add(parseInt(tm[1]), 'hours');
    dt.add(parseInt(tm[2]), 'minutes');
  }

  return dt.toDate();
}

function createButton(node) {
  const nameEl = node.querySelector('.window-title h2');
  const dueDateEl = node.querySelector('.js-date-text');

  const name = nameEl.innerText;
  const date = findDate(dueDateEl.innerText);
  const link = location.href;

  const state = new ButtonState({
    link,
    task: {
      name,
      end_date: date,
      notes: generateTaskNotes('Trello', link),
    },
    anchor: 'screen',
    view: TrelloButtonView,
  });

  const buttonEl = state.button.render().el;

  setTimeout(() => {
    const actionsEl = node
      .querySelectorAll('.window-sidebar > .window-module')[1]
      .querySelector('.u-clearfix');
    actionsEl.insertBefore(buttonEl, actionsEl.firstChild);
  }, 1000);

  titleObserver(node, state);
  dueDateObserver(node, state);

  buttons.set(node, state);
}

function removeButton(node) {
  const button = buttons.get(node);
  if (button) {
    button.remove();
  }
}

function handleError(error) {
  console.error(error);
}

function titleObserver(node, state) {
  const nameInput = node.querySelector('.js-card-detail-title-input');
  if (nameInput) {
    nameInput.addEventListener(
      'change',
      () => {
        state.task.name = nameInput.value;
      },
      false
    );
  }
}

function dueDateObserver(node, state) {
  const el = document.querySelector('.pop-over');
  const o = new MutationObserver(() => {
    setTimeout(() => {
      if (!el.classList.contains('is-shown')) {
        const card = document.querySelector('.js-card-detail-due-date');
        if (card.classList.contains('hide')) {
          state.task.end_date = null;
          return;
        }
        const dueDateEl = node.querySelector('.js-date-text');
        state.task.end_date = findDate(dueDateEl.innerText);
      }
    }, 300);
  });

  o.observe(el, { childList: true });
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
