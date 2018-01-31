const View = require('ampersand-view');
const permissions = require('../../utils/permissions');
const services = require('./services.json');

const ItemView = View.extend({
  template: require('./item.hbs'),

  derived: {
    service: {
      deps: ['model.service'],
      fn() {
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

  onRemove() {
    permissions.remove(this.model.domain).then(() => this.model.destroy());
  }
});

module.exports = ItemView;
