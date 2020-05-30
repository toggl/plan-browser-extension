import View from 'ampersand-view';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    model: ['state', true],
    parent: ['object', true],
    index: ['number', true],
  },

  bindings: {
    'model.string': {
      type: 'innerHTML',
      hook: 'label',
    },
    'model.original.id': [
      {
        type: 'attribute',
        name: 'data-model-id',
      },
      {
        type: 'attribute',
        name: 'data-id',
        hook: 'edit-icon',
      },
    ],
    'model.original.colorClass': {
      type: 'class',
      hook: 'label',
    },
    index: {
      type: 'attribute',
      name: 'data-index',
    },
    'model.original.textColor': {
      hook: 'label',
      type(el, color) {
        el.style.color = color;
      },
    },
  },
});
