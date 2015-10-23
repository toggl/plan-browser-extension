var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var api = require('../../../api/api');
var TaskView = require('../task/task_view');
var AuthView = require('../auth/auth_view');
var LoaderView = require('../loader/loader_view');
var ErrorView = require('../error/error_view');

var PopupView = View.extend({

  template: require('./popup_view.hbs'),

  props: {
    hub: 'state',
    task: 'state',
    loader: 'state',
    error: 'state',
    direction: {
      type: 'string',
      values: ['left', 'right', 'center'],
      default: 'right'
    }
  },

  bindings: {
    direction: {
      type: function(el, value, previous) {
        if (previous) el.classList.remove('popup--' + previous);
        if (value) el.classList.add('popup--' + value);
      }
    }
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:show:task', this.updateContentView);
    this.listenTo(this.hub, 'error:show', this.showError);
    this.listenTo(this.hub, 'error:hide', this.hideError);
  },

  render: function() {
    this.renderWithTemplate();

    this.loader = new LoaderView({ hub: this.hub });
    this.renderSubview(this.loader);

    this.switcher = new ViewSwitcher(this.queryByHook('popup-content'));
    this.registerSubview(this.switcher);

    this.updateContentView();
  },

  updateContentView: function() {
    var content = api.auth.authenticated ?
      new TaskView({ hub: this.hub, model: this.task }) :
      new AuthView({ hub: this.hub });
    
    this.switcher.set(content);
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
  }

});

module.exports = PopupView;
