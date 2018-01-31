const View = require('ampersand-view');
const CustomDomainCollection = require('../../models/custom_domain_collection');
const ItemView = require('./item');
const FormView = require('./form');

const CustomDomainsView = View.extend({
  template: require('./custom_domains.hbs'),

  props: {
    form: 'state'
  },

  bindings: {
    'form.error': {
      type: 'text',
      hook: 'error'
    }
  },

  initialize() {
    this.collection = new CustomDomainCollection();
    this.collection.fetch();

    this.form = new FormView({collection: this.collection});
  },

  render() {
    this.renderWithTemplate();

    const body = this.query('tbody');
    this.renderCollection(this.collection, ItemView, body);

    const footer = this.query('tfoot');
    this.renderSubview(this.form, footer);

    return this;
  }
});

module.exports = CustomDomainsView;
