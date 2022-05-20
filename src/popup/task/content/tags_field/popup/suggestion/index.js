import AmpersandView from 'ampersand-view';
import TagView from '../../tag';

import css from './style.module.scss';
import template from './template.dot';

export default AmpersandView.extend({
  template,
  css,

  props: {
    model: 'state',
    onSelect: ['any', true],
  },

  events: {
    click: 'onClick',
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

  subviews: {
    tagView: {
      hook: 'suggestion:container',
      prepareView() {
        const view = new TagView({
          model: this.model.original,
        });
        return view;
      },
    },
  },

  onClick(event) {
    event.preventDefault();
    this.onSelect(this.model.original);
  },
});
