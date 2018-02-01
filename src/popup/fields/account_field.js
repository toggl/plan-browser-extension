const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const preferences = require('../../utils/preferences');

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
    this.value = parseInt(this.queryByHook('select').value, 10);
    preferences.set({selected_account_id: this.value});
  },

  switchAccount(account) {
    this.value = account.id;
    this.render();
  },

  initialize() {
    this.sortedAccounts = new FilteredCollection(this.accounts, {
      comparator: 'name'
    });
  }
});

module.exports = AccountField;
