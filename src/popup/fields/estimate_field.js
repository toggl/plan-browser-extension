const View = require('ampersand-view');
const isEmpty = require('lodash.isempty');
const TextField = require('../controls/input');

const EstimateField = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    raw: 'string',
    isValid: 'boolean',
    inputOpts: 'object',
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

  bindings: {
    raw: { type: 'value' },
    isFilled: { type: 'booleanClass', no: 'estimate-input--empty' },
    lengthClass: { type: 'class' }
  },

  initialize() {
    if (this.value) {
      this.raw = String(this.value);
    }

    this.input = new TextField(Object.assign({}, this.inputOpts, {
      placeholder: '0',
      name: 'estimate',
      label: 'Daily estimate'
    }));

    this.listenTo(this.input, 'change', this.onChange);
    this.listenTo(this.input, 'input', this.onInput);
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
    this.renderWithTemplate(this);
    this.renderSubview(this.input);
    return this;
  },
});

module.exports = EstimateField;
