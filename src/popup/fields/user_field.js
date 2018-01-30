const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('user_list_value', function(options) {
  return JSON.stringify(options.hash);
});

const UserField = View.extend({
  template: require('./user_field_default.hbs'),

  props: {
    value: 'object'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn() {
        return JSON.stringify(this.value);
      }
    },
    isFilled: {
      deps: ['hasAccount'],
      fn() {
        return this.hasAccount;
      }
    },
    hasAccount: {
      deps: ['value'],
      fn() {
        return !!this.value && !!this.value.account;
      }
    },
    hasUser: {
      deps: ['value'],
      fn() {
        return !!this.value && !!this.value.user;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    formatted: { type: 'value' }
  },

  onChange() {
    this.value = JSON.parse(this.el.value);
  },

  render() {
    this.el.innerHTML = this.template(this);
    this.renderCollection(this.collection, UserGroup, this.el);
    return this;
  }
});

const UserGroup = View.extend({
  template: require('./user_field_group.hbs'),

  props: {
    users: 'object'
  },

  initialize() {
    this.users = new FilteredCollection(this.model.users, {
      where: { active: true },
      comparator: 'name'
    });
  },

  render() {
    this.renderWithTemplate();
    return this;
  }
});

module.exports = UserField;
