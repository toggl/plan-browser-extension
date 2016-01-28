var View = require('ampersand-view');

var TextField = View.extend({

  props: {
    value: 'string'
  },

  derived: {
    isFilled: {
      deps: ['value'],
      fn: function() {
        return this.value != null && this.value.length > 0;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    value: { type: 'value' }
  },

  onChange: function(event) {
    this.value = this.el.value;
  },

  focus: function() {
    this.el.setSelectionRange(0, this.value.length);
    this.el.focus();
  },

  render: function() {
    return this;
  }

});

module.exports = TextField;
