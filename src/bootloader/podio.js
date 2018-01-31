const domify = require('domify');
const moment = require('moment');
const HashMap = require('hashmap');
const find = require('lodash.find');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');

const buttons = new HashMap();
const observers = new HashMap();

const DATE_RE = /(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/;

function createOverlayObserver() {
  observer.create('.item-overlay')
    .onAdded(createContentObserver)
    .onRemoved(removeContentObserver)
    .start();
}

function createContentObserver(element) {
  const o = observer.create('.app-item-id', element)
    .onAdded(function() {
      createButton(element);
    })
    .start();

  observers.set(element, o);
}

function removeContentObserver(element) {
  const o = observers.get(element);
  if (o) {
    o.stop();
  }

  removeButton(element);
}

function findDate(deadline) {
  deadline = deadline.replace(/\s+/g, ' ');

  const matches = DATE_RE.exec(deadline);
  if (!matches) {
    return;
  }

  const m = moment(matches[0], 'DD MMMM YYYY');
  if (!m.isValid()) {
    return;
  }

  return m.toDate();
}

function findTitleEl(element) {
  const textFields = element.querySelectorAll('.small-text-field');
  if (textFields.length === 0) {
    return null;
  }

  const firstField = textFields[0];
  const titleField = find(textFields, function(element) {
    return /title/i.exec(element.className);
  });

  return titleField || firstField;
}

function findDeadlineEl(element) {
  const dateFields = element.querySelectorAll('.date-field');
  return (dateFields.length > 0) ? dateFields[0] : null;
}

function findValueEl(element) {
  return element.querySelector('.value');
}

function createButton(element) {
  const titleEl = findTitleEl(element);
  const deadlineEl = findDeadlineEl(element);

  const name = titleEl ? findValueEl(titleEl).innerText : undefined;
  const date = deadlineEl
    ? findDate(findValueEl(deadlineEl).innerText)
    : undefined;
  const link = location.href;

  const state = new ButtonState({
    task: {
      name,
      end_date: date,
      notes: 'Added from Podio: ' + link
    },
    link,
    anchor: 'element'
  });

  const actionsEl = document.body.querySelector('.item-topbar-actions ul');
  const itemEl = domify('<li class="float-left teamweek"></li>');
  const buttonEl = state.button.render().el;

  itemEl.appendChild(buttonEl);
  actionsEl.insertBefore(itemEl, actionsEl.firstChild);

  buttons.set(element, state);
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
    .then(createOverlayObserver)
    .catch(handleError);
}
