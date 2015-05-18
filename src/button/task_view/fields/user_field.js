var View = require('ampersand-view');
var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('user_list_value', function(options) {
  return JSON.stringify(options.hash);
});

var UserField = View.extend({

  template: require('./user_field.hbs'),

  props: {
    value: 'object'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return JSON.stringify(this.value);
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
    return this;
  }

});

module.exports = UserField;
