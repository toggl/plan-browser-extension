const View = require('ampersand-view');

const StyleView = View.extend({
  template: require('./style_view.hbs'),

  props: {
    style: 'string'
  },

  render() {
    this.renderWithTemplate(this);
    return this;
  }
});

module.exports = StyleView;
