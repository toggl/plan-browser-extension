var View = require('ampersand-view');
var StyleView = require('../style/style_view');

var ShadowView = View.extend({

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

  render: function() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    if (this.style != null) {
      var style = new StyleView({ style: this.style });
      this.renderSubview(style, this.shadow);
    }

    if (this.content != null) {
      this.renderSubview(this.content, this.shadow);
    }

    return this;
  },

  stopPropagation: function(event) {
    event.stopPropagation();
  }

});

module.exports = ShadowView;
