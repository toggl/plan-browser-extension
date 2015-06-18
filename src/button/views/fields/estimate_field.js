var View = require('ampersand-view');
var isEmpty = require('lodash.isempty');

var EstimateField = View.extend({

  props: {
    value: 'number',
    raw: 'string',
    isValid: 'boolean'
  },

  derived: {
    isFilled: {
      deps: ['raw'],
      fn: function() {
        return this.raw != null && this.raw.length > 0;
      }
    },
    inputLength: {
      deps: ['raw'],
      fn: function() {
        return !isEmpty(this.raw) ? this.raw.length : 1;
      }
    },
    lengthClass: {
      deps: ['inputLength'],
      fn: function() {
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

  initialize: function() {
    if (this.value != null) this.raw = String(this.value);
  },

  onInput: function(event) {
    this.raw = event.target.value;
  },

  onChange: function(event) {
    var value = parseInt(this.raw, 10);

    this.isValid = !isNaN(value);
    this.value = this.isValid ? value : null;
  },

  render: function() {
    return this;
  }

});

module.exports = EstimateField;
