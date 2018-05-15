const moment = require('moment');
const HashMap = require('hashmap');
const AmpersandView = require('ampersand-view');
const ButtonState = require('../button/button.js');
const observer = require('../utils/observer');

const TrelloButtonView = AmpersandView.extend({
  template: require('./trello.hbs'),

  props: {
    hub: 'state'
  },

  events: {
    'click': 'onClick'
  },

  render() {
    this.renderWithTemplate();
    return this;
  },

  onClick(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  }
});

const buttons = new HashMap();

function createObserver() {
  observer.create('.card-detail-window')
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
      if (!(/\w{4}$/.test(date))) {
        date += ` ${moment().format('YYYY')}`;
      }
      dt = moment(date);
  }

  const tm = /^(\d{1,2})\:(\d{1,2})\s/.exec(time);

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
      notes: 'Added from Trello: ' + link
    },
    anchor: 'screen',
    view: TrelloButtonView
  });

  const buttonEl = state.button.render().el;
  const actionsEl = node.querySelector('.window-module.other-actions > div');
  actionsEl.insertBefore(buttonEl, actionsEl.firstChild);

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

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
