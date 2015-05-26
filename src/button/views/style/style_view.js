var View = require('ampersand-view');

var StyleView = View.extend({

  template: require('./style_view.hbs'),

  props: {
    style: 'string'
  },

  render: function() {
    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = StyleView;
