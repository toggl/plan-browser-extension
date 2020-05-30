import View from 'ampersand-view';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    model: 'state',
    parent: ['state', true],
  },

  bindings: {
    'model.name': {
      type: 'text',
      hook: 'tag-label',
    },
    'model.colorClass': {
      type: 'class',
    },
    'model.textColor': {
      hook: 'tag-label',
      type(el, color) {
        el.style.color = color;
      },
    },
  },
});
