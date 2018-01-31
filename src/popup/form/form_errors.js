const View = require('ampersand-view');

const FormErrors = View.extend({
  template: require('./form_errors.hbs'),

  props: {
    errors: 'array',
    isVisible: 'boolean'
  },

  derived: {
    firstError: {
      deps: ['errors'],
      fn() {
        if (!this.errors) {
          return null;
        }
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

  render() {
    this.renderWithTemplate();
  },

  addError(error) {
    this.errors = this.errors.concat(error);
    this.isVisible = true;
  },

  clearErrors() {
    this.isVisible = false;
    this.errors = [];
  }
});

module.exports = FormErrors;
