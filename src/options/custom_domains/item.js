var View = require('ampersand-view');

var ItemView = View.extend({

  template: require('./item.hbs'),

  bindings: {
    'model.domain': {
      type: 'text',
      hook: 'domain'
    },
    'model.service': {
      type: 'text',
      hook: 'service'
    }
  },

  render: function() {
    this.renderWithTemplate();
    return this
  }

});

module.exports = ItemView;
