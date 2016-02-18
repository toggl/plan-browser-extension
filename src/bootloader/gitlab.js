var moment = require('moment');
var HashMap = require('hashmap');
var offset = require('document-offset');
var ButtonState = require('../button/button');
var observer = require('../utils/observer');

var buttons = new HashMap();

var DATE_RE = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})/;

function createObserver() {
  observer.create('[data-page="projects:milestones:index"] .milestone')
    .onAdded(createButton.bind(null, createMilestoneIndexButton))
    .onRemoved(removeButton)
    .start();

  observer.create('[data-page="projects:issues:index"] .issue')
    .onAdded(createButton.bind(null, createIssueIndexButton))
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

  return {
    task: {
      name: linkEl.innerText,
      end_date: findDate(element.innerText)
    },
    link: linkEl.href,
    container: titleEl
  };
}

function createIssueIndexButton(element) {
  var titleEl = element.querySelector('.issue-title');
  var linkEl = titleEl.querySelector('a');

  return {
    task: {
      name: linkEl.innerText,
      notes: 'Added from GitLab: ' + linkEl.href
    },
    link: linkEl.href,
    container: titleEl
  };
}

function createButton(callback, element) {
  var config = callback(element);

  var state = new ButtonState({
    task: config.task,
    link: config.link,
    anchor: 'screen'
  });

  var buttonEl = state.button.render().el;
  config.container.appendChild(buttonEl);
  
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
