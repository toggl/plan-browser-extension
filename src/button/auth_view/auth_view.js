var View = require('ampersand-view');

var AuthView = View.extend({

  template: require('./auth_view.dom'),

  render: function() {
    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = AuthView;
