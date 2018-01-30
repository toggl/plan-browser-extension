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

const DATE_RE = /(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)( (\d{4}))?/;

function createObserver() {
  observer.create('.card-detail-window')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(meta) {
  const matches = DATE_RE.exec(meta);
  if (!matches) {
    return;
  }

  const m = moment(matches[0], 'DD MMM YYYY');
  if (!m.isValid()) {
    return;
  }

  return m.toDate();
}

function createButton(node) {
  const titleEl = node.querySelector('.window-title h2');
  const dueDateEl = node.querySelector('.js-card-detail-due-date-badge');

  const name = titleEl.innerText;
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
