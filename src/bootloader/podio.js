const domify = require('domify');
const moment = require('moment');
const HashMap = require('hashmap');
const find = require('lodash.find');
const ButtonState = require('../button/button');
const observer = require('../utils/observer');

const buttons = new HashMap();
const observers = new HashMap();

const DATE_RE = /(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/;

class Observer {
  removeButton(node) {
    const button = buttons.get(node);
    if (button) {
      button.remove();
    }
  }
}

class ProjectViewObserver extends Observer {
  constructor() {
    super();

    observer
      .create('.item-overlay')
      .onAdded(el => this.createContentObserver(el))
      .onRemoved(el => this.removeContentObserver(el))
      .start();
  }

  createContentObserver(element) {
    const o = observer
      .create('.app-item-id', element)
      .onAdded(() => this.createButton(element))
      .start();

    observers.set(element, o);
  }

  removeContentObserver(element) {
    const o = observers.get(element);
    if (o) {
      o.stop();
    }

    this.removeButton(element);
  }

  findDate(deadline) {
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

  findTitleEl(element) {
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

  findDeadlineEl(element) {
    const dateFields = element.querySelectorAll('.date-field');
    return dateFields.length > 0 ? dateFields[0] : null;
  }

  findValueEl(element) {
    return element.querySelector('.value');
  }

  createButton(element) {
    const titleEl = this.findTitleEl(element);
    const deadlineEl = this.findDeadlineEl(element);

    const name = titleEl ? this.findValueEl(titleEl).innerText : undefined;
    const date = deadlineEl
      ? this.findDate(this.findValueEl(deadlineEl).innerText)
      : undefined;
    const link = location.href;

    const state = new ButtonState({
      task: {
        name,
        end_date: date,
        notes: 'Added from Podio: ' + link,
      },
      link,
      anchor: 'element',
    });

    const actionsEl = document.body.querySelector('.item-topbar-actions ul');
    const itemEl = domify('<li class="float-left teamweek"></li>');
    const buttonEl = state.button.render().el;

    itemEl.appendChild(buttonEl);
    actionsEl.insertBefore(itemEl, actionsEl.firstChild);

    buttons.set(element, state);
  }
}

class TaskViewObserver extends Observer {
  constructor() {
    super();
    observer
      .create('.tasks .action-bar ul')
      .onAdded(el => this.createContentObserver(el))
      .onRemoved(el => this.removeContentObserver(el))
      .start();
  }

  createContentObserver(element) {
    this.createButton(element);
  }

  removeContentObserver(element) {
    const o = observers.get(element);
    if (o) {
      o.stop();
    }

    this.removeButton(element);
  }

  createButton(actionsEl) {
    const nameEl = document.body.querySelector('.header-title');
    const dateEl = document.body.querySelector('.field-datetime .timestamp');

    const nameBarEl = document.querySelector('.task-title');
    if (nameBarEl) {
      nameBarEl.addEventListener(
        'click',
        () =>
          nameBarEl
            .querySelector('input')
            .addEventListener(
              'change',
              event => (state.task.name = event.target.value),
              false
            ),
        false
      );
    }

    // todo: due date change detect

    const name = nameEl ? nameEl.innerText : undefined;
    const date = dateEl ? dateEl.innerText : undefined;
    const link = location.href;

    const state = new ButtonState({
      task: {
        name,
        end_date: date,
        notes: 'Added from Podio: ' + link,
      },
      link,
      anchor: 'element',
    });

    const itemEl = domify('<li class="float-left teamweek"></li>');
    const buttonEl = state.button.render().el;

    itemEl.appendChild(buttonEl);
    actionsEl.appendChild(itemEl);

    buttons.set(actionsEl, state);
  }
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(() => {
      new ProjectViewObserver();
      new TaskViewObserver();
    })
    .catch(err => console.error(err));
}
