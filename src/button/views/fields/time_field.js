var moment = require('moment');
var View = require('ampersand-view');

var TimeField = View.extend({

  props: {
    value: 'string',
    focus: 'boolean'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value, 'HH:mm').format('HH:mm:ss') : null;
      }
    },
    showPlaceholder: {
      deps: ['focus', 'isFilled'],
      fn: function() {
        return !this.focus && !this.isFilled;
      }
    },
    isFilled: {
      deps: ['value'],
      fn: function() {
        return this.value != null;
      }
    }
  },

  events: {
    'change [data-hook=control]': 'onChange',
    'click [data-hook=placeholder]': 'onClick',
    'blur [data-hook=control]': 'onBlur'
  },

  bindings: {
    formatted: { type: 'value' },
    showPlaceholder: {
      type: 'toggle',
      yes: '[data-hook=placeholder]',
      no: '[data-hook=control]'
    }
  },

  onChange: function(event) {
    var m = moment(this.queryByHook('control').value, 'HH:mm:ss a');
    this.value = m.isValid() ? m.format('HH:mm') : null;
  },

  onClick: function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.focus = true;
    this.queryByHook('control').focus();
  },

  onBlur: function(event) {
    this.focus = false;
  },

  render: function() {
    return this;
  }

});

module.exports = TimeField;
