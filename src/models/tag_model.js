import Model from 'ampersand-model';
import sync from '../api/api_sync';

const TagModel = Model.extend({
  sync,

  props: {
    id: ['number'],
    name: ['string', true],
    color_id: ['number', true],
    plan_id: 'number',
  },

  derived: {
    colorClass: {
      deps: ['color_id'],
      fn() {
        return `color-${this.color_id || 30}`;
      },
    },
    nameLowerCased: {
      deps: ['name'],
      fn() {
        return (this.name || '').toLowerCase();
      },
    },
  },
});

export default TagModel;
