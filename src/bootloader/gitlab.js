const moment = require('moment');
const HashMap = require('hashmap');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');

const buttons = new HashMap();

const DATE_RE = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})/;

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
  const matches = DATE_RE.exec(title);
  if (!matches) {
    return;
  }

  const m = moment(matches[0], 'MMM DD, YYYY');
  if (!m.isValid()) {
    return;
  }

  return m.toDate();
}

function createMilestoneIndexButton(element) {
  const titleEl = element.querySelector('.col-sm-6, h4');
  const linkEl = titleEl.querySelector('a');

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
  const titleEl = element.querySelector('.issue-title');
  const linkEl = titleEl.querySelector('a');

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
  const config = callback(element);

  const state = new ButtonState({
    task: config.task,
    link: config.link,
    anchor: 'screen'
  });

  const buttonEl = state.button.render().el;
  config.container.appendChild(buttonEl);

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
    .then(createObserver)
    .catch(handleError);
}
