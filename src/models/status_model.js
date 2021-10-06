import Model from 'ampersand-model';
import sync from '../api/api_sync';
import { getEmoji } from '../utils/emoji';

export default Model.extend({
  sync,

  extraProperties: 'allow',
  comparator: 'position',

  props: {
    position: 'number',
    id: 'number',
    label: 'string',
    icon: 'string',
  },

  derived: {
    name: {
      deps: ['label', 'icon'],
      fn() {
        return [getEmoji(this.icon) || '', this.label || ''].join(' ');
      },
    },
  },
});
