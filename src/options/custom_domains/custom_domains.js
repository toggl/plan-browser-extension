var View = require('ampersand-view');
var CustomDomainCollection = require('../../models/custom_domain_collection');
var ItemView = require('./item');

var CustomDomainsView = View.extend({

  template: require('./custom_domains.hbs'),

  initialize: function() {
    this.collection = new CustomDomainCollection([
      {domain: 'gitlab.websupport.sk', service: 'gitlab'}
    ]);
  },

  render: function() {
    this.renderWithTemplate();

    var container = this.query('tbody')
    this.renderCollection(this.collection, ItemView, container);

    return this;
  }

});

module.exports = CustomDomainsView;
