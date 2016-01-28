var domify = require('domify');
var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
var find = require('lodash.find');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();
var observers = new HashMap();

var DATE_RE = /(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/;
 
function createOverlayObserver() {
  observer.create('.item-overlay')
    .onAdded(createContentObserver)
    .onRemoved(removeContentObserver)
    .start();
}

function createContentObserver(element) {
  var o = observer.create('.app-item-id', element)
    .onAdded(function() {
      createButton(element);
    })
    .start();

  observers.set(element, o);
}

function removeContentObserver(element) {
  var o = observers.get(element);
  if (o != null) o.stop();

  removeButton(element);
}

function findDate(deadline) {
  deadline = deadline.replace(/\s+/g, ' ');
  
  var matches = DATE_RE.exec(deadline);
  if (matches == null) return;

  var m = moment(matches[0], 'DD MMMM YYYY');
  if (!m.isValid()) return;

  return m.toDate();
}

function findTitleEl(element) {
  var textFields = element.querySelectorAll('.small-text-field');
  if (textFields.length == 0) return null;

  var firstField = textFields[0];
  var titleField = find(textFields, function(element) {
    return /title/i.exec(element.className);
  });

  return titleField || firstField;
}

function findDeadlineEl(element) {
  var dateFields = element.querySelectorAll('.date-field');
  return (dateFields.length > 0) ? dateFields[0] : null;
}

function findValueEl(element) {
  return element.querySelector('.value');
}

function createButton(element) {
  var titleEl = findTitleEl(element);
  var deadlineEl = findDeadlineEl(element);

  var name = titleEl ? findValueEl(titleEl).innerText : undefined;
  var date = deadlineEl ? findDate(findValueEl(deadlineEl).innerText) : undefined;
  var link = location.href;
  
  var state = new ButtonState({
    task: {name: name, end_date: date},
    link: link,
    anchor: 'element'
  });

  var actionsEl = document.body.querySelector('.item-topbar-actions ul');
  var itemEl = domify('<li class="float-left teamweek"></li>');
  var buttonEl = state.button.render().el;

  itemEl.appendChild(buttonEl);
  actionsEl.insertBefore(itemEl, actionsEl.firstChild);

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
    .then(createOverlayObserver)
    .catch(handleError);
}
