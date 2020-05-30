import View from 'ampersand-view';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    model: ['state', true],
    parent: ['state', true],
  },

  bindings: {
    'model.id': [
      {
        type: 'attribute',
        name: 'data-id',
      },
      {
        type: 'attribute',
        name: 'data-id',
        hook: 'tag-remove',
      },
    ],
    'model.name': {
      type: 'text',
      hook: 'tag-label',
    },
    'model.colorClass': {
      type: 'class',
    },
    'parent.parent.canRemove': {
      type: 'toggle',
      hook: 'tag-remove',
    },
    'model.textColor': [
      {
        type: 'attribute',
        name: 'fill',
        hook: 'tag-remove-icon-svg-path',
      },
      {
        hook: 'tag-label',
        type(el, color) {
          el.style.color = color;
        },
      },
    ],
  },
});
