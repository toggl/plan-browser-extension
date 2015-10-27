var Promise = require('bluebird');
var State = require('ampersand-state');
var api = require ('../api/api');
var ShadowView = require('./views/shadow/shadow_view');
var ButtonView = require('./views/button/button_view');
var PopupView = require('./views/popup/popup_view');
var TaskModel = require('../models/task_model');
var collections = require('../models/collections');
var analytics = require('../utils/analytics');

var HubState = State.extend({});

var ButtonState = State.extend({

  props: {
    link: 'string',
    button: 'state',
    popup: 'state',
    task: 'object',
    layout: {
      type: 'string',
      values: ['popup', 'modal'],
      default: 'popup'
    }
  },

  children: {
    hub: HubState
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:open', this.createPopup);
    this.listenTo(this.hub, 'popup:close', this.destroyPopup);
    this.listenTo(this.hub, 'button:clicked', this.handleButtonClick);
    this.listenTo(this.hub, 'task:open', this.handleTaskOpen);
    this.listenTo(this.hub, 'task:created', this.handleTaskCreated);

    this.button = new ShadowView({
      name: 'tw-button',
      style: require('../../app/styles/button.css'),
      content: new ButtonView({
        hub: this.hub
      })
    });

    ButtonState.setLoaded();
  },

  handleButtonClick: function() {
    var taskLink = collections.taskLinks.find({
      source_link: this.link
    });

    if (taskLink != null) {
      this.hub.trigger('task:open', taskLink.task_id, taskLink.account_id);
    } else {
      this.hub.trigger('popup:open');
    }
  },

  handleTaskOpen: function(task, account) {
    var url = `https://app.teamweek.com/#timeline/task/${account}/${task}`;
    window.open(url, '_blank');
  },

  handleTaskCreated: function(task, account) {
    collections.taskLinks.create({
      task_id: task.id,
      account_id: account.id,
      source_link: this.link
    });
  },

  createPopup: function() {
    var task = new TaskModel(this.task);
    var name = (this.type == 'popup') ? 'tw-popup' : 'tw-modal';

    this.popup = new ShadowView({
      name: name,
      style: require('../../app/styles/popup.css'),
      content: new PopupView({
        hub: this.hub,
        task: task
      })
    });

    this.trigger('popup:created');

    analytics.track('button', 'click');
  },

  destroyPopup: function() {
    this.popup.remove();
    this.popup = null;
    
    this.trigger('popup:destroyed');
  },

  remove: function() {
    this.button.remove();
    if (this.popup != null) this.popup.remove();
    if (this.overlay != null) this.overlay.remove();
  }

});

ButtonState.initialize = function() {
  return Promise.all([
    api.auth.load(),
    collections.taskLinks.fetch()
  ]);
};

ButtonState.isLoaded = function() {
  return window['__tw-button'];
};

ButtonState.setLoaded = function() {
  window['__tw-button'] = true;
};

module.exports = ButtonState;
