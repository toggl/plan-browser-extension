var Promise = require('bluebird');
var State = require('ampersand-state');
var ShadowView = require('./views/shadow/shadow_view');
var ButtonView = require('./views/button/button_view');
var TaskModel = require('../models/task_model');
var collections = require('../models/collections');
var analytics = require('../utils/analytics');

var HubState = State.extend({});

var ButtonState = State.extend({

  props: {
    link: 'string',
    button: 'state',
    task: 'object',
    anchor: {
      type: 'string',
      values: ['element', 'screen'],
      default: 'screen'
    }
  },

  children: {
    hub: HubState
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:open', this.createPopup);
    this.listenTo(this.hub, 'button:clicked', this.handleButtonClick);
    this.listenTo(this.hub, 'task:open', this.handleTaskOpen);

    this.button = new ShadowView({
      name: 'tw-button',
      style: require('../../app/styles/button.css'),
      content: new ButtonView({
        hub: this.hub
      })
    });

    ButtonState.setLoaded();
  },

  handleButtonClick: function(event) {
    if (this.link == null) {
      this.hub.trigger('popup:open', event);
      return;
    }
    
    var taskSource = collections.taskSources.find({
      source_link: this.link
    });

    if (taskSource != null) {
      this.hub.trigger('task:open', taskSource.task_id, taskSource.account_id);
    } else {
      this.hub.trigger('popup:open', event);
    }
  },

  handleTaskOpen: function(task, account) {
    var url = `https://app.teamweek.com/#timeline/task/${account}/${task}`;
    window.open(url, '_blank');
  },

  createPopup: function(event) {
    var model = new TaskModel(this.task);
    var params = Object.assign({link: this.link}, model.serialize());

    chrome.runtime.sendMessage({
      type: 'open_popup',
      params: params,
      anchor: this.anchor,
      screen: {
        width: window.outerWidth,
        height: window.outerHeight
      },
      element: event ? {
        x: event.screenX,
        y: event.screenY
      } : null
    });

    analytics.track('button', 'click');
  },

  remove: function() {
    this.button.remove();
  }

});

ButtonState.initialize = function() {
  return Promise.all([
    collections.taskSources.fetch()
  ]);
};

ButtonState.isLoaded = function() {
  return window['__tw-button'];
};

ButtonState.setLoaded = function() {
  window['__tw-button'] = true;
};

module.exports = ButtonState;
