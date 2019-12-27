import View from 'ampersand-view';
import IconView from 'src/popup/task/content/user_field/icon';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    parent: ['object', true],
    onSelect: ['any', true],
  },

  bindings: {
    'model.string': {
      type: 'innerHTML',
      hook: 'label',
    },
    'model.original.id': {
      type: 'attribute',
      name: 'data-model-id',
    },
  },

  events: {
    click: 'onClick',
  },

  subviews: {
    icon: {
      hook: 'icon',
      prepareView() {
        const {
          model: { original: model },
        } = this;
        return new IconView({ model });
      },
    },
  },

  onClick(event) {
    event.preventDefault();
    this.onSelect(this.model.original);
  },
});
