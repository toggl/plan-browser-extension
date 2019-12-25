import View from 'ampersand-view';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    show: ['boolean', false, true],
  },

  bindings: {
    show: {
      type: 'toggle',
    },
  },
});
