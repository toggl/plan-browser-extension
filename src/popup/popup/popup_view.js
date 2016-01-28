var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var api = require('../../api/api');
var TaskView = require('../task/task_view');
var AuthView = require('../auth/auth_view');
var LoaderView = require('../loader/loader_view');
var ErrorView = require('../error/error_view');
var collections = require('../../models/collections');

var PopupView = View.extend({

  template: require('./popup_view.hbs'),

  props: {
    hub: 'object',
    link: 'string',
    task: 'state',
    loader: 'state',
    error: 'state'
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:update', this.updateContentView);
    this.listenTo(this.hub, 'popup:close', this.closePopup);
    this.listenTo(this.hub, 'error:show', this.showError);
    this.listenTo(this.hub, 'error:hide', this.hideError);
    this.listenTo(this.hub, 'task:created', this.saveTaskSource);
  },

  render: function() {
    this.renderWithTemplate();

    this.loader = new LoaderView({ hub: this.hub });
    this.renderSubview(this.loader);

    this.switcher = new ViewSwitcher(this.queryByHook('popup-content'));
    this.registerSubview(this.switcher);

    this.updateContentView();

    return this;
  },

  updateContentView: function() {
    var content = api.auth.authenticated ?
      new TaskView({ hub: this.hub, model: this.task }) :
      new AuthView({ hub: this.hub });
    
    this.switcher.set(content);
  },

  closePopup: function() {
    chrome.windows.getCurrent(function(window) {
      chrome.windows.remove(window.id);
    });
  },

  showError: function(error) {
    if (error.message == 'refresh_denied') {
      this.updateContentView();
    } else {
      this.error = new ErrorView({ hub: this.hub, error: error });
      this.renderSubview(this.error);
    }
  },

  hideError: function() {
    this.error.remove();
  },

  saveTaskSource: function(task, account) {
    if (this.link == null) return;

    collections.taskSources.create({
      task_id: task.id,
      account_id: account.id,
      source_link: this.link
    });
  }

});

module.exports = PopupView;
