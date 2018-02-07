const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const SelectField = require('../fields/select');

module.exports = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    users: 'object',
    selectOpts: 'object',
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

  createInput() {
    const options = [
      '<option value="-2">Add to backlog</option>',
      ...this
        .users
        .map(user => `<option value=${user.id}>${user.name}</option>`)
    ].join('');

    return new SelectField(Object.assign({}, this.selectOpts, {
      label: 'User',
      name: 'user',
      placeholder: 'Choose user...',
      options,
      validations: [{
        run: value => !!value,
        message: '*Choose a user',
      }],
    }));
  },

  switchAccount(account) {
    this.users = new FilteredCollection(account.users, {
      where: { active: true },
      comparator: 'name'
    });
    this.value = null;
    this.render();
    this.renderSubview(this.createInput()); // todo
  }
});
