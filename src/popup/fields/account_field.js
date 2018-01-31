const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('is_selected', function(a, b) {
  return a === b ? 'selected' : '';
});

const AccountField = View.extend({
  template: require('./account_field.hbs'),

  props: {
    value: 'number',
    accounts: 'collection',
    sortedAccounts: 'object',
  },

  events: {
    'change select': 'onChange'
  },

  onChange() {
    this.value = JSON.parse(this.queryByHook('select').value);
  },

  switchAccount(account) {
    this.value = account.id;
    this.render();
  },

  render() {
    this.sortedAccounts = new FilteredCollection(this.accounts, {
      comparator: 'name'
    });

    this.el.innerHTML = this.template(this);

    return this;
  }
});

module.exports = AccountField;
