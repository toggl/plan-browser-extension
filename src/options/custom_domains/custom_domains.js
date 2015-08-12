var View = require('ampersand-view');
var CustomDomainCollection = require('../../models/custom_domain_collection');
var ItemView = require('./item');
var FormView = require('./form');

var CustomDomainsView = View.extend({

  template: require('./custom_domains.hbs'),

  initialize: function() {
    this.collection = new CustomDomainCollection([
      {domain: 'gitlab.websupport.sk', service: 'gitlab'},
      {domain: 'example.com', service: 'gitlab'}
    ]);

    this.form = new FormView({collection: this.collection});
  },

  render: function() {
    this.renderWithTemplate();

    var body = this.query('tbody');
    this.renderCollection(this.collection, ItemView, body);

    var footer = this.query('tfoot');
    this.renderSubview(this.form, footer);

    return this;
  }

});

module.exports = CustomDomainsView;
