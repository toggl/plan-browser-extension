const moment = require('moment');
const View = require('ampersand-view');
const TimepickerView = require('../timepicker/timepicker_view.js');

const TimeField = View.extend({
  props: {
    value: 'string',
    hasFocus: 'boolean',
    pickedTime: 'boolean',
    timepicker: 'state'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn() {
        return this.value ? moment(this.value, 'HH:mm').format('LT') : null;
      }
    },
    showTimepicker: {
      deps: ['hasFocus', 'pickedTime'],
      fn() {
        return this.hasFocus && !this.pickedTime;
      }
    },
    isFilled: {
      deps: ['value'],
      fn() {
        return !!this.value;
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
      type(el, value) {
        el.value = value;
      },
      hook: 'control'
    },
    showTimepicker: {
      type: 'toggle',
      hook: 'timepicker'
    }
  },

  onChange() {
    const m = moment(this.queryByHook('control').value, 'LT');
    this.value = m.isValid() ? m.format('HH:mm') : null;
  },

  onFocus() {
    this.hasFocus = true;
    this.pickedTime = false;
    this.timepicker.scroll();
  },

  onBlur() {
    this.hasFocus = false;
  },

  render() {
    this.timepicker = new TimepickerView();
    this.listenTo(this.timepicker, 'select', this.onTimePicked);
    this.renderSubview(this.timepicker, this.queryByHook('timepicker'));

    return this;
  },

  onTimePicked(time) {
    this.value = time;
    this.pickedTime = true;
  }
});

module.exports = TimeField;
