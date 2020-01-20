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
    'model.name': {
      type: 'text',
      hook: 'tag-label',
    },
  },

  subviews: {
    icon: {
      hook: 'tag-icon',
      prepareView() {
        const { model } = this;
        return new IconView({ model });
      },
    },
  },
});
