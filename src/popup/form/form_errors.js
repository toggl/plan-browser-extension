var View = require('ampersand-view');

var FormErrors = View.extend({

  template: require('./form_errors.hbs'),

  props: {
    errors: 'array',
    isVisible: 'boolean'
  },

  derived: {
    firstError: {
      deps: ['errors'],
      fn: function() {
        if (this.errors == null) return null;
        return this.errors.length > 0 ? this.errors[0] : null;
      }
    }
  },

  bindings: {
    firstError: {
      type: 'text'
    },
    isVisible: {
      type: 'booleanClass',
      yes: 'form-errors--visible',
      no: 'form-errors--hidden'
    }
  },

  render: function() {
    this.renderWithTemplate();
  },

  addError: function(error) {
    this.errors = this.errors.concat(error);
    this.isVisible = true;
  },

  clearErrors: function() {
    this.isVisible = false;
    this.errors = [];
  }

});

module.exports = FormErrors;
