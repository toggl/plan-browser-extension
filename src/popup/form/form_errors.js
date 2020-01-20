import View from 'ampersand-view';
import template from './form_errors.hbs';

const FormErrors = View.extend({
  template,

  props: {
    errors: 'array',
    isVisible: 'boolean',
  },

  derived: {
    firstError: {
      deps: ['errors'],
      fn() {
        if (!this.errors) {
          return null;
        }
        return this.errors.length > 0 ? this.errors[0] : null;
      },
    },
  },

  bindings: {
    firstError: {
      type: 'text',
    },
    isVisible: {
      type: 'booleanClass',
      yes: 'form-errors--visible',
      no: 'form-errors--hidden',
    },
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
  },
});

export default FormErrors;
