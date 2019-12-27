import View from 'ampersand-view';
import template from './template.dot';
import css from 'src/popup/task/content/select_field/popup/suggestion-item/style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    model: 'object',
  },

  bindings: {
    iconColorClass: {
      type: 'class',
    },
    model: {
      type: 'toggle',
    },
  },

  derived: {
    iconColorClass: {
      deps: ['model.color_id'],
      fn() {
        const { model } = this;
        if (model) {
          return `color-${model.color_id}`;
        }

        return 'color-21';
      },
    },
  },
});
