import View from 'ampersand-view';
import template from './style_view.hbs';

const StyleView = View.extend({
  template,

  props: {
    style: 'string',
  },

  render() {
    this.renderWithTemplate(this);
    return this;
  },
});

export default StyleView;
