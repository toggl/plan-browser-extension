import AmpersandView from 'ampersand-view';

import css from './style.module.scss';
import template from './template.dot';

export default AmpersandView.extend({
  template,
  css,

  props: {
    model: 'state',
    canRemove: 'boolean',
    onRemove: 'any',
  },

  derived: {
    className: {
      deps: ['model.colorClass'],
      fn() {
        return this.model.colorClass;
      },
    },
  },

  bindings: {
    'model.name': {
      type: 'text',
      hook: 'tag:content',
    },
    'model.id': {
      type: 'attribute',
      name: 'data-id',
      hook: 'tag:remove',
    },
    className: {
      type: 'class',
      hook: 'tag:container',
    },
    canRemove: {
      type: 'toggle',
      hook: 'tag:remove',
    },
  },
});
