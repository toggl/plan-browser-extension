var View = require('ampersand-view');
var proxy = require('../../proxy');
var ButtonView = require('../button_view/button_view');
var TaskView = require('../task_view/task_view');
var AuthView = require('../auth_view/auth_view');

var ContainerView = View.extend({

  template: require('./container_view.dom'),

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

    proxy.call('isAuthenticated')
      .then(function(result) {
        var popup = result ? new TaskView() : new AuthView();
        self.renderSubview(popup);
      });
  }

});

module.exports = ContainerView;
