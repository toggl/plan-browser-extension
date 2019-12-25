import View from 'ampersand-view';
import IconView from 'src/popup/task/content/user_field/icon';
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
    'model.id': {
      type: 'attribute',
      name: 'data-id',
      hook: 'tag-remove',
    },
    'model.name': {
      type: 'text',
      hook: 'tag-label',
    },
    'parent.parent.canRemove': {
      type: 'toggle',
      hook: 'tag-remove',
    },
  },

  events: {
    'click [data-hook=tag-remove]': 'onRemove',
  },

  subviews: {
    icon: {
      hook: 'tag-icon',
      prepareView(el) {
        const { model } = this;
        return new IconView({ el, model });
      },
    },
  },
});
