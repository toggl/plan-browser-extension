var View = require('ampersand-view');

var CustomDomainsView = View.extend({

  template: require('./custom_domains.hbs'),

  render: function() {
    this.renderWithTemplate();
    return this;
  }

});

module.exports = CustomDomainsView;
