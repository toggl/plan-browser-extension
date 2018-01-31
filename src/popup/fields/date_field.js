const moment = require('moment');
const View = require('ampersand-view');
const DatepickerView = require('../datepicker/datepicker_view.js');

const DateField = View.extend({
  props: {
    value: 'date',
    hasFocus: 'boolean',
    pickedDate: 'boolean',
    datepicker: 'state'
  },

  derived: {
    formatted: {
      deps: ['value'],
      fn() {
        return this.value ? moment(this.value).format('L') : null;
      }
    },
    isFilled: {
      deps: ['value'],
      fn() {
        return !!this.value;
      }
    },
    showDatepicker: {
      deps: ['hasFocus', 'pickedDate'],
      fn() {
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
      type(el, value) {
        el.value = value;
      },
      hook: 'control'
    },
    showDatepicker: {
      type: 'toggle',
      hook: 'datepicker'
    }
  },

  onChange(event) {
    const m = moment(event.target.value);
    this.value = m.isValid() ? m.toDate() : null;
  },

  onFocus() {
    this.hasFocus = true;
    this.pickedDate = false;
  },

  onBlur() {
    this.hasFocus = false;
  },

  render() {
    this.datepicker = new DatepickerView();
    this.listenTo(this.datepicker, 'select', this.onDatePicked);
    this.renderSubview(this.datepicker, this.queryByHook('datepicker'));

    return this;
  },

  onDatePicked(date) {
    this.value = date;
    this.pickedDate = true;
  }
});

module.exports = DateField;
