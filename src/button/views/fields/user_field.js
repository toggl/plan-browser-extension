var View = require('ampersand-view');
var FilteredCollection = require('ampersand-filtered-subcollection');
var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('user_list_value', function(options) {
  return JSON.stringify(options.hash);
});

var UserField = View.extend({

  template: require('./user_field_default.hbs'),

  props: {
    value: 'object'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return JSON.stringify(this.value);
      }
    },
    isFilled: {
      deps: ['value'],
      fn: function() {
        return this.value != null && this.value.user != null && this.value.account != null;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    formatted: { type: 'value' }
  },

  onChange: function(event) {
    this.value = JSON.parse(this.el.value);
  },

  render: function() {
    this.el.innerHTML = this.template(this);
    this.renderCollection(this.collection, UserGroup, this.el);
    return this;
  }

});

var UserGroup = View.extend({

  template: require('./user_field_group.hbs'),

  props: {
    users: 'object'
  },

  initialize: function() {
    this.users = new FilteredCollection(this.model.users, {
      where: { active: true },
      comparator: 'name'
    });
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  }

});

module.exports = UserField;
