var View = require('ampersand-view');
var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('user_list_value', function(options) {
  return JSON.stringify(options.hash);
});

var UserListView = View.extend({

  props: {
    id: 'string',
    name: 'string'
  },

  template: require('./user_list_view.hbs'),

  render: function() {
    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = UserListView;
