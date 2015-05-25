var View = require('ampersand-view');
var StyleView = require('../style/style_view');

var ShadowView = View.extend({

  template: require('./shadow_view.hbs'),

  props: {
    name: 'string',
    style: 'string',
    content: 'state'
  },

  render: function() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    if (this.style != null) {
      var style = new StyleView({ name: this.style });
      this.renderSubview(style, this.shadow);
    }

    if (this.content != null) {
      this.renderSubview(this.content, this.shadow);
    }

    return this;
  }

});

module.exports = ShadowView;
