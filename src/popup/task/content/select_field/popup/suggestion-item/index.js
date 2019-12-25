import View from 'ampersand-view';
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
      prepareView(el) {
        const {
          model: { original: model },
        } = this;
        return new this.parent.parent.parent.iconView({ model, el });
      },
    },
  },

  onClick(event) {
    event.preventDefault();
    this.onSelect(this.model.original);
  },
});
