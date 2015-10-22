var View = require('ampersand-view');
var permissions = require('../../utils/permissions');
var services = require('./services.json');

var ItemView = View.extend({

  template: require('./item.hbs'),

  derived: {
    service: {
      deps: ['model.service'],
      fn: function() {
        return services[this.model.service];
      }
    }
  },

  bindings: {
    'model.domain': {
      type: 'text',
      hook: 'domain'
    },
    'service': {
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
        return self.model.destroy();
      });
  }

});

module.exports = ItemView;
