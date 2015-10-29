var domify = require('domify');
var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
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

function createButton(element) {
  var titleEl = element.querySelector('#deliverable-title .value, #title .value');
  var deadlineEl = element.querySelector('#deadline .value');
  var actionsEl = document.body.querySelector('.item-topbar-actions ul');

  var name = titleEl.innerText;
  var date = findDate(deadlineEl.innerText);
  var link = location.href;
  
  var state = new ButtonState({
    task: {name: name, end_date: date},
    link: link
  });

  var itemEl = domify('<li class="float-left teamweek"></li>');
  var buttonEl = state.button.render().el;

  itemEl.appendChild(buttonEl);
  actionsEl.insertBefore(itemEl, actionsEl.firstChild);

  state.on('popup:created', function() {
    var popupEl = state.popup.render().el;

    var position = offset(buttonEl);
    position.right = window.innerWidth - buttonEl.clientWidth - position.left;

    state.popup.content.direction = 'left';
    popupEl.style.position = 'fixed';
    popupEl.style.right = position.right + 'px';
    popupEl.style.top = position.top + 'px';

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
    .then(createOverlayObserver)
    .catch(handleError);
}
