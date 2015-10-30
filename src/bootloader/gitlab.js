var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();

var DATE_RE = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})/;

function createObserver() {
  observer.create('[data-page="projects:milestones:index"] .milestone')
    .onAdded(createMilestoneIndexButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(title) {
  var matches = DATE_RE.exec(title);
  if (matches == null) return;

  var m = moment(matches[0], 'MMM DD, YYYY');
  if (!m.isValid()) return;

  return m.toDate();
}

function createMilestoneIndexButton(element) {
  var titleEl = element.querySelector('.col-sm-6, h4');
  var linkEl = titleEl.querySelector('a');

  var name = linkEl.innerText;
  var date = findDate(element.innerText);
  var link = linkEl.href;

  var state = new ButtonState({
    task: {name: name, end_date: date},
    link: link,
    type: 'modal'
  });

  var buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;
    state.popup.content.direction = 'center';
    document.body.appendChild(popupEl);
  });

  buttons.set(element, state);
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
