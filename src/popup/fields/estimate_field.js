const View = require('ampersand-view');
const isEmpty = require('lodash.isempty');

const EstimateField = View.extend({
  props: {
    value: 'number',
    raw: 'string',
    isValid: 'boolean'
  },

  derived: {
    isFilled: {
      deps: ['raw'],
      fn() {
        return this.raw && this.raw.length > 0;
      }
    },
    inputLength: {
      deps: ['raw'],
      fn() {
        return !isEmpty(this.raw) ? this.raw.length : 1;
      }
    },
    lengthClass: {
      deps: ['inputLength'],
      fn() {
        return 'estimate-input--length-' + this.inputLength;
      }
    }
  },

  events: {
    'change [data-hook=control]': 'onChange',
    'input [data-hook=control]': 'onInput'
  },

  bindings: {
    raw: { type: 'value', hook: 'control' },
    isFilled: { type: 'booleanClass', no: 'estimate-input--empty' },
    lengthClass: { type: 'class' }
  },

  initialize() {
    if (this.value) {
      this.raw = String(this.value);
    }
  },

  onInput(event) {
    this.raw = event.target.value;
  },

  onChange() {
    const value = parseInt(this.raw, 10);

    this.isValid = !isNaN(value);
    this.value = this.isValid ? value : null;
  },

  render() {
    return this;
  }
});

module.exports = EstimateField;
