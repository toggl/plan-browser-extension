const View = require('ampersand-view');

const TextField = View.extend({
  props: {
    value: 'string'
  },

  derived: {
    isFilled: {
      deps: ['value'],
      fn() {
        return this.value && this.value.length > 0;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    value: { type: 'value' }
  },

  onChange() {
    this.value = this.el.value;
  },

  focus() {
    this.el.setSelectionRange(0, this.value.length);
    this.el.focus();
  },

  render() {
    return this;
  }
});

module.exports = TextField;
