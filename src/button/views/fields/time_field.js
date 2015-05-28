var moment = require('moment');
var View = require('ampersand-view');
var TimepickerView = require('../timepicker/timepicker_view.js');

var TimeField = View.extend({

  props: {
    value: 'string',
    hasFocus: 'boolean',
    pickedTime: 'boolean',
    timepicker: 'state'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value, 'HH:mm').format('LT') : null;
      }
    },
    showTimepicker: {
      deps: ['hasFocus', 'pickedTime'],
      fn: function() {
        return this.hasFocus && !this.pickedTime;
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
    'focus [data-hook=control]': 'onFocus',
    'blur [data-hook=control]': 'onBlur'
  },

  bindings: {
    formatted: {
      type: 'value',
      hook: 'control'
    },
    showTimepicker: {
      type: 'toggle',
      hook: 'timepicker'
    }
  },

  onChange: function(event) {
    var m = moment(this.queryByHook('control').value, 'LT');
    this.value = m.isValid() ? m.format('HH:mm') : null;
  },

  onFocus: function(event) {
    this.hasFocus = true;
    this.pickedTime = false;
    this.timepicker.scroll();
  },

  onBlur: function(event) {
    this.hasFocus = false;
  },

  render: function() {
    this.timepicker = new TimepickerView();
    this.listenTo(this.timepicker, 'select', this.onTimePicked);
    this.renderSubview(this.timepicker, this.queryByHook('timepicker'));

    return this;
  },

  onTimePicked: function(time) {
    this.value = time;
    this.pickedTime = true;
  }

});

module.exports = TimeField;
