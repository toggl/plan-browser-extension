const View = require('ampersand-view');
const StyleView = require('../style/style_view');

const ShadowView = View.extend({
  template: require('./shadow_view.hbs'),

  props: {
    name: 'string',
    style: 'string',
    content: 'state'
  },

  events: {
    'click': 'stopPropagation',
    'keyup': 'stopPropagation',
    'keydown': 'stopPropagation',
    'keypress': 'stopPropagation'
  },

  render() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    if (this.style) {
      const style = new StyleView({ style: this.style });
      this.renderSubview(style, this.shadow);
    }

    if (this.content) {
      this.renderSubview(this.content, this.shadow);
    }

    return this;
  },

  stopPropagation(event) {
    event.stopPropagation();
  }
});

module.exports = ShadowView;
