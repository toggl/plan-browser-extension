var State = require('ampersand-state');
var api = require ('../api/api');
var ShadowView = require('./views/shadow/shadow_view');
var ButtonView = require('./views/button/button_view');
var PopupView = require('./views/popup/popup_view');
var TaskModel = require('../models/task_model');
var analytics = require('../utils/analytics');

var HubState = State.extend({});

var ButtonState = State.extend({

  props: {
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
    this.hub.trigger('popup:open');
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
  return api.auth.load();
};

ButtonState.isLoaded = function() {
  return window['__tw-button'];
};

ButtonState.setLoaded = function() {
  window['__tw-button'] = true;
};

module.exports = ButtonState;
