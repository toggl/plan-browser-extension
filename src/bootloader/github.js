var moment = require('moment');
var HashMap = require('hashmap');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();

var DATE_RE = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})/;
 
function createObserver() {
  observer.create('.milestone')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(meta) {
  var matches = DATE_RE.exec(meta);
  if (matches == null) return;

  var m = moment(matches[0], 'MMMM DD, YYYY');
  if (!m.isValid()) return;

  return m.toDate();
}

function createButton(element) {
  var titleEl = element.querySelector('.milestone-title-link');
  var metaEl = element.querySelector('.milestone-meta');
  var linkEl = titleEl.querySelector('a');

  var name = titleEl.querySelector('a').innerText;
  var date = findDate(metaEl.innerText);
  var link = linkEl.href;
  
  var state = new ButtonState({
    link: link,
    task: { name: name, end_date: date },
    anchor: 'element'
  });

  var buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

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
