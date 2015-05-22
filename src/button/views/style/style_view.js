var View = require('ampersand-view');

var StyleView = View.extend({

  template: require('./style_view.hbs'),

  render: function() {
    this.renderWithTemplate({ id: chrome.runtime.id });
    return this;
  }

});

module.exports = StyleView;
