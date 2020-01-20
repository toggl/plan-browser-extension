import _ from 'lodash';
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
    'user.image': [
      {
        type: 'attribute',
        name: 'src',
        hook: 'image',
      },
      {
        type: 'toggle',
        hook: 'image',
      },
      {
        type: 'toggle',
        hook: 'icon',
        invert: true,
      },
    ],
    'user.initials': [
      {
        type: 'text',
        hook: 'initials',
      },
      {
        type: 'toggle',
        hook: 'initials-picture',
      },
    ],
    // model: {
    //   type: 'toggle',
    // },
  },

  derived: {
    user: {
      deps: ['model.picture_url', 'model.initials'],
      fn() {
        const { model } = this;
        if (model) {
          const { picture_url, initials } = model;
          if (picture_url && !_.includes(picture_url, 'missing.png')) {
            return { image: picture_url };
          }
          return { initials };
        }
        return { initials: '' };
      },
    },
  },
});
