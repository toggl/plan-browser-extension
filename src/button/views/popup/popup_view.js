var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var api = require('../../api/api');
var TaskView = require('../task/task_view');
var AuthView = require('../auth/auth_view');

var PopupView = View.extend({

  template: require('./popup_view.hbs'),

  render: function() {
    this.renderWithTemplate();

    this.switcher = new ViewSwitcher(this.el);
    this.registerSubview(this.switcher);

    var content = api.auth.authenticated ? new TaskView() : new AuthView();
    this.switcher.set(content);
  }

});

module.exports = PopupView;
