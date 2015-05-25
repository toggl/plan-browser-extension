var View = require('ampersand-view');

var StyleView = View.extend({

  template: require('./style_view.hbs'),

  props: {
    name: 'string'
  },

  render: function() {
    this.renderWithTemplate({ id: chrome.runtime.id, name: this.name });
    return this;
  }

});

module.exports = StyleView;
