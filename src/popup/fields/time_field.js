const moment = require('moment');
const View = require('ampersand-view');
const TimepickerView = require('../timepicker/timepicker_view.js');
const TextField = require('../controls/input');

const template = `<div class="time-input">
  <div data-hook=input></div>
  <div class="time-input__timepicker" data-hook=timepicker></div>
</div>`;

const TimeField = View.extend({
  template,

  props: {
    value: 'string',
    hasFocus: 'boolean',
    pickedTime: 'boolean',
    timepicker: 'state',
    inputOpts: 'object',
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

  bindings: {
    formatted: {
      type(el, value) {
        el.value = value;
      },
      hook: 'input'
    },
    showTimepicker: {
      type: 'toggle',
      hook: 'timepicker'
    }
  },

  initialize() {
    if (this.value) {
      this.raw = String(this.value);
    }

    this.timepicker = new TimepickerView();
    this.listenTo(this.timepicker, 'select', this.onTimePicked);

    this.input = new TextField(Object.assign({}, this.inputOpts, {
      placeholder: 'Set time...',
    }));
    this.listenTo(this.input, 'change', this.onChange);
    this.listenTo(this.input, 'focus', this.onFocus);
    this.listenTo(this.input, 'blur', this.onBlur);
  },

  onChange() {
    const m = moment(this.input.value, 'LT');
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
    this.renderWithTemplate(this);
    this.renderSubview(this.input, this.queryByHook('input'));
    this.renderSubview(this.timepicker, this.queryByHook('timepicker'));
    return this;
  },

  onTimePicked(time) {
    this.value = time;
    this.pickedTime = true;
  }
});

module.exports = TimeField;
