const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');

const UserField = View.extend({
  template: require('./user_field.hbs'),

  props: {
    value: 'number',
    users: 'object',
  },

  derived: {
    isFilled: {
      deps: ['hasUser'],
      fn() {
        return this.hasUser;
      }
    },
    hasUser: {
      deps: ['value'],
      fn() {
        return !!this.value;
      }
    }
  },

  events: {
    'change select': 'onChange'
  },

  onChange() {
    this.value = parseInt(this.queryByHook('select').value, 10);
  },

  switchAccount(account) {
    this.users = new FilteredCollection(account.users, {
      where: { active: true },
      comparator: 'name'
    });
    this.value = null;
    this.render();
  }
});

module.exports = UserField;
