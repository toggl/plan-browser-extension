var moment = require('moment');
var View = require('ampersand-view');
var TimepickerView = require('../timepicker/timepicker_view.js');

var TimeField = View.extend({

  props: {
    value: 'string',
    hasFocus: 'boolean',
    pickedTime: 'boolean'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn: function() {
        return this.value != null ? moment(this.value, 'HH:mm').format('HH:mm:ss') : null;
      }
    },
    showPlaceholder: {
      deps: ['hasFocus', 'isFilled'],
      fn: function() {
        return !this.hasFocus && !this.isFilled;
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
    'click [data-hook=placeholder]': 'onClick',
    'focus [data-hook=control]': 'onFocus',
    'blur [data-hook=control]': 'onBlur'
  },

  bindings: {
    formatted: {
      type: 'value',
      hook: 'control'
    },
    showPlaceholder: {
      type: 'toggle',
      yes: '[data-hook=placeholder]',
      no: '[data-hook=control]'
    },
    showTimepicker: {
      type: 'toggle',
      hook: 'timepicker'
    }
  },

  onChange: function(event) {
    var m = moment(this.queryByHook('control').value, 'HH:mm:ss a');
    this.value = m.isValid() ? m.format('HH:mm') : null;
  },

  onClick: function(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hasFocus = true;
    this.queryByHook('control').focus();
  },

  onFocus: function(event) {
    this.hasFocus = true;
    this.pickedTime = false;
  },

  onBlur: function(event) {
    this.hasFocus = false;
  },

  render: function() {
    var timepicker = new TimepickerView();
    this.listenTo(timepicker, 'select', this.onTimePicked);
    this.renderSubview(timepicker, this.queryByHook('timepicker'));

    return this;
  },

  onTimePicked: function(time) {
    this.value = time;
    this.pickedTime = true;
  }

});

module.exports = TimeField;
