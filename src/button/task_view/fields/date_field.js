var moment = require('moment');
var View = require('ampersand-view');

var DateField = View.extend({

  props: {
    value: 'date'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value).format('YYYY-MM-DD') : null;
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
    var m = moment(this.el.value);
    this.value = m.isValid() ? m.toDate() : null;
  },

  render: function() {
    return this;
  }

});

module.exports = DateField;
