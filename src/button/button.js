var State = require('ampersand-state');
var api = require ('./api/api');
var ShadowView = require('./views/shadow/shadow_view');
var ButtonView = require('./views/button/button_view');
var PopupView = require('./views/popup/popup_view');
var TaskModel = require('./models/task_model');

var HubState = State.extend({});

var ButtonState = State.extend({

  props: {
    button: 'state',
    popup: 'state',
    task: 'object',
  },

  children: {
    hub: HubState
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:open', this.createPopup);
    this.listenTo(this.hub, 'popup:close', this.destroyPopup);

    this.button = new ShadowView({
      name: 'tw-button',
      style: require('../../app/styles/button.css'),
      content: new ButtonView({
        hub: this.hub
      })
    });
  },

  createPopup: function() {
    var task = new TaskModel(this.task);

    this.popup = new ShadowView({
      name: 'tw-popup',
      style: require('../../app/styles/popup.css'),
      content: new PopupView({
        hub: this.hub,
        task: task
      })
    });

    this.trigger('popup:created');
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

module.exports = ButtonState;
