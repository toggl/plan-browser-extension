var moment = require('moment');
var View = require('ampersand-view');
var DatepickerView = require('../datepicker/datepicker_view.js');

var DateField = View.extend({

  props: {
    value: 'date',
    hasFocus: 'boolean',
    pickedDate: 'boolean',
    datepicker: 'state'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value).format('L') : null;
      }
    },
    isFilled: {
      deps: ['value'],
      fn: function() {
        return this.value != null;
      }
    },
    showDatepicker: {
      deps: ['hasFocus', 'pickedDate'],
      fn: function() {
        return this.hasFocus && !this.pickedDate;
      }
    }
  },

  events: {
    'change [data-hook=control]': 'onChange',
    'focus [data-hook=control]': 'onFocus',
    'blur [data-hook=control]': 'onBlur'
  },

  bindings: {
    formatted: {
      type: 'value',
      hook: 'control'
    },
    showDatepicker: {
      type: 'toggle',
      hook: 'datepicker'
    }
  },

  onChange: function(event) {
    var m = moment(event.target.value);
    this.value = m.isValid() ? m.toDate() : null;
  },

  onFocus: function() {
    this.hasFocus = true;
    this.pickedDate = false;
  },

  onBlur: function() {
    this.hasFocus = false;
  },

  render: function() {
    this.datepicker = new DatepickerView();
    this.listenTo(this.datepicker, 'select', this.onDatePicked);
    this.renderSubview(this.datepicker, this.queryByHook('datepicker'));

    return this;
  },

  onDatePicked: function(date) {
    this.value = date;
    this.pickedDate = true;
  }

});

module.exports = DateField;
