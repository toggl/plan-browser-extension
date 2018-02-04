const moment = require('moment');
const View = require('ampersand-view');
const DatepickerView = require('../datepicker/datepicker_view.js');
const TextField = require('../controls/input');

const template = `<div class="date-input">
  <div data-hook=input></div>
  <div class="date-input__datepicker" data-hook=datepicker></div>
</div>`;

const DateField = View.extend({
  template,

  props: {
    value: 'date',
    hasFocus: 'boolean',
    pickedDate: 'boolean',
    datepicker: 'state',
    inputOpts: 'object',
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

  bindings: {
    formatted: {
      type(el, value) {
        el.value = value;
      },
      hook: 'input'
    },
    showDatepicker: {
      type: 'toggle',
      hook: 'datepicker'
    }
  },

  onChange(event) {
    if (event.target) {
      const m = moment(event.target.value);
      this.value = m.isValid() ? m.toDate() : null;
    }
  },

  onFocus() {
    this.hasFocus = true;
    this.pickedDate = false;
  },

  onBlur() {
    this.hasFocus = false;
  },

  initialize() {
    if (this.value) {
      this.raw = String(this.value);
    }

    this.datepicker = new DatepickerView();
    this.listenTo(this.datepicker, 'select', this.onDatePicked);

    this.input = new TextField(Object.assign({}, this.inputOpts, {
      placeholder: 'Set date...',
    }));
    this.listenTo(this.input, 'change', this.onChange);
    this.listenTo(this.input, 'focus', this.onFocus);
    this.listenTo(this.input, 'blur', this.onBlur);
  },

  render() {
    this.renderWithTemplate(this);
    this.renderSubview(this.datepicker, this.queryByHook('datepicker'));
    this.renderSubview(this.input, this.queryByHook('input'));
    return this;
  },

  onDatePicked(date) {
    this.value = date;
    this.pickedDate = true;
  }
});

module.exports = DateField;
