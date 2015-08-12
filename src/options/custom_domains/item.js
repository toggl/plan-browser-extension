var View = require('ampersand-view');
var permissions = require('../../utils/permissions');

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

  events: {
    'click [data-hook=remove]': 'onRemove'
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onRemove: function() {
    var self = this;

    permissions.remove(this.model.domain)
      .then(function() {
        self.collection.remove(self.model);
      });
  }

});

module.exports = ItemView;
