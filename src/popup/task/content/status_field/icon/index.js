import View from 'ampersand-view';
import template from './template.dot';
import css from 'src/popup/task/content/select_field/popup/suggestion-item/style.module.scss';
import { getEmoji } from 'src/utils/emoji';

export default View.extend({
  template,
  css,

  props: {
    model: 'object',
  },

  bindings: {
    emoji: {
      type: 'text',
    },
    model: {
      type: 'toggle',
    },
  },

  derived: {
    emoji: {
      deps: ['model.icon'],
      fn() {
        return this.model ? getEmoji(this.model.icon) : '';
      },
    },
  },
});
