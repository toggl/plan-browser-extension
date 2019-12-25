import View from 'ampersand-view';
import permissions from '../../utils/permissions';
import services from './services.json';
import template from './item.hbs';

const ItemView = View.extend({
  template,

  derived: {
    service: {
      deps: ['model.service'],
      fn() {
        return services[this.model.service];
      },
    },
  },

  bindings: {
    'model.domain': {
      type: 'text',
      hook: 'domain',
    },
    service: {
      type: 'text',
      hook: 'service',
    },
  },

  events: {
    'click [data-hook=remove]': 'onRemove',
  },

  onRemove() {
    permissions.remove(this.model.domain).then(() => this.model.destroy());
  },
});

export default ItemView;
