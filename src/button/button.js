const Promise = require('bluebird');
const State = require('ampersand-state');
const ButtonView = require('./views/button/button_view');
const TaskModel = require('../models/task_model');
const collections = require('../models/collections');
const analytics = require('../utils/analytics');

const HubState = State.extend({});

const ButtonState = State.extend({
  props: {
    link: 'string',
    button: 'state',
    task: 'any',
    anchor: {
      type: 'string',
      values: ['element', 'screen'],
      default: 'screen',
    },
    view: {
      type: 'any',
      required: true,
      default() {
        return ButtonView;
      },
    },
  },

  children: {
    hub: HubState,
  },

  initialize() {
    this.listenTo(this.hub, 'popup:open', this.createPopup);
    this.listenTo(this.hub, 'button:clicked', this.handleButtonClick);
    this.listenTo(this.hub, 'task:open', this.handleTaskOpen);

    this.button = new this.view({ hub: this.hub });

    ButtonState.setLoaded();
  },

  handleButtonClick(event) {
    if (!this.link) {
      this.hub.trigger('popup:open', event);
      return;
    }

    const taskSource = collections.taskSources.find({
      source_link: this.link,
    });

    if (taskSource) {
      this.hub.trigger('task:open', taskSource.task_id, taskSource.account_id);
    } else {
      this.hub.trigger('popup:open', event);
    }
  },

  handleTaskOpen(task, account) {
    const url = `https://app.teamweek.com/#timeline/task/${account}/${task}`;
    window.open(url, '_blank');
  },

  createPopup(event) {
    const params = this.getTaskParams();

    chrome.runtime.sendMessage({
      type: 'open_popup',
      params,
      anchor: this.anchor,
      screen: {
        width: window.outerWidth,
        height: window.outerHeight,
      },
      element: event
        ? {
            x: event.screenX,
            y: event.screenY,
          }
        : null,
    });

    analytics.track('button', 'click');
  },

  getTaskParams() {
    let taskParams;

    if (typeof this.task === 'function') {
      taskParams = this.task.call(null);
    } else if (typeof this.task === 'object') {
      taskParams = this.task;
    } else {
      taskParams = {};
    }

    const model = new TaskModel(taskParams);

    return Object.assign({ link: this.link }, model.serialize());
  },

  remove() {
    this.button.remove();
  },
});

ButtonState.initialize = function() {
  return Promise.all([collections.taskSources.fetch()]);
};

ButtonState.isLoaded = function() {
  return window['__tw-button'];
};

ButtonState.setLoaded = function() {
  window['__tw-button'] = true;
};

module.exports = ButtonState;
