var View = require('ampersand-view');
var api = require('../../api/api');
var ButtonView = require('../button_view/button_view');
var TaskView = require('../task_view/task_view');
var AuthView = require('../auth_view/auth_view');

var ContainerView = View.extend({

  template: require('./container_view.hbs'),

  render: function() {
    this.renderWithTemplate();

    var button = new ButtonView();
    this.listenTo(button, 'click', this.showPopup);
    this.renderSubview(button);

    this.showPopup();

    return this;
  },

  showPopup: function() {
    var self = this;

    var popup = api.auth.authenticated ? new TaskView() : new AuthView();
    this.renderSubview(popup);
  }

});

module.exports = ContainerView;
