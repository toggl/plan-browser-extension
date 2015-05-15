var View = require('ampersand-view');

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
