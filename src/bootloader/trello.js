var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
var AmpersandView = require('ampersand-view');
var ButtonState = require('../button/button.js');
var observer = require('../utils/observer');

var TrelloButtonView = AmpersandView.extend({
  template: require('./trello.hbs'),

  props: {
    hub: 'state'
  },

  events: {
    'click': 'onClick'
  },
  
  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  }
});

var buttons = new HashMap();

var DATE_RE = /(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)( (\d{4}))?/;

function createObserver() {
  observer.create('.card-detail-window')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(meta) {
  var matches = DATE_RE.exec(meta);
  if (matches == null) return;

  var m = moment(matches[0], 'DD MMM YYYY');
  if (!m.isValid()) return;

  return m.toDate();
}

function createButton(node) {
  var titleEl = node.querySelector('.window-title h2');
  var dueDateEl = node.querySelector('.js-card-detail-due-date-badge');

  var name = titleEl.innerText;
  var date = findDate(dueDateEl.innerText);
  var link = location.href;

  var state = new ButtonState({
    link: link,
    task: {
      name: name,
      end_date: date,
      notes: 'Added from Trello: ' + link
    },
    anchor: 'screen',
    view: TrelloButtonView
  });

  var buttonEl = state.button.render().el;
  var actionsEl = node.querySelector('.window-module.other-actions > div');
  actionsEl.insertBefore(buttonEl, actionsEl.firstChild);

  buttons.set(node, state);
}

function removeButton(node) {
  var button = buttons.get(node);
  if (button != null) button.remove();
}

function handleError(error) {
  console.error(error);
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
