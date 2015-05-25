var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var api = require('../../api/api');
var TaskView = require('../task/task_view');
var AuthView = require('../auth/auth_view');
var LoaderView = require('../loader/loader_view');
var ErrorView = require('../error/error_view');

var PopupView = View.extend({

  template: require('./popup_view.hbs'),

  props: {
    hub: 'state',
    task: 'state'
  },

  initialize: function() {
    this.listenTo(this.hub, 'popup:show:task', this.updateContentView);
    this.listenTo(this.hub, 'error:hide', this.updateContentView);
    this.listenTo(this.hub, 'error:show', this.showError);
  },

  render: function() {
    this.renderWithTemplate();

    var loader = new LoaderView({ hub: this.hub });
    this.renderSubview(loader);

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
    var content = new ErrorView({ hub: this.hub, error: error });
    this.switcher.set(content);
  }

});

module.exports = PopupView;
