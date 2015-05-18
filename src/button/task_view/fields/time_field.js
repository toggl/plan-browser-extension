var moment = require('moment');
var View = require('ampersand-view');

var TimeField = View.extend({

  props: {
    value: 'string'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value, 'HH:mm').format('HH:mm:ss') : null;
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
    'change': 'onChange'
  },

  bindings: {
    formatted: { type: 'value' }
  },

  onChange: function(event) {
    var m = moment(this.el.value, 'HH:mm:ss a');
    this.value = m.isValid() ? m.format('HH:mm') : null;
  },

  render: function() {
    return this;
  }

});

module.exports = TimeField;
