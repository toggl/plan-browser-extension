import View from 'ampersand-view';
import CustomDomainCollection from '../../models/custom_domain_collection';
import ItemView from './item';
import FormView from './form';
import template from './custom_domains.hbs';

const CustomDomainsView = View.extend({
  template,

  props: {
    form: 'state',
  },

  bindings: {
    'form.error': {
      type: 'text',
      hook: 'error',
    },
  },

  initialize() {
    this.collection = new CustomDomainCollection();
    this.collection.fetch();

    this.form = new FormView({ collection: this.collection });
  },

  render() {
    this.renderWithTemplate();

    const body = this.query('tbody');
    this.renderCollection(this.collection, ItemView, body);

    const footer = this.query('tfoot');
    this.renderSubview(this.form, footer);

    return this;
  },
});

export default CustomDomainsView;
