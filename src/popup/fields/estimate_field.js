const View = require('ampersand-view');
const template = require('./estimate_field.hbs');

module.exports = View.extend({
  template,

  props: {
    value: ['number', false, 0],
    hours: ['number', false, 0],
    minutes: ['number', false, 0],
    disabled: 'boolean',
    isEditing: 'boolean',
    tabIndex: 'number',
  },

  events: {
    'click [data-hook=estimate-field-add]': 'onAddClicked',
    'click [data-hook=estimate-field-subtract]': 'onSubtractClicked',
    'blur [data-hook=estimate-field-input-hours]': 'onHoursUpdate',
    'blur [data-hook=estimate-field-input-minutes]': 'onMinutesUpdate',
    'input [data-hook=estimate-field-input-hours]': 'validateHoursInput',
    'input [data-hook=estimate-field-input-minutes]': 'validateMinutesInput',
    'focus .estimate-field__input': 'onFocusInput',
    click: 'startEditing',
    focus: 'startEditing',
  },

  derived: {
    hasValue: {
      deps: ['value'],
      fn() {
        return !!this.value;
      },
    },
    showEmpty: {
      deps: ['isEditing', 'hasValue'],
      fn() {
        return !this.isEditing && !this.hasValue;
      },
    },
    showInput: {
      deps: ['isEditing', 'hasValue'],
      fn() {
        return this.isEditing;
      },
    },
    showLabel: {
      deps: ['isEditing', 'hasValue'],
      fn() {
        return !this.isEditing && this.hasValue;
      },
    },
    label: {
      deps: ['value', 'hours', 'minutes'],
      fn() {
        if (this.value === null) {
          return;
        }
        const hours = `${this.hours}h`;
        const minutes = this.minutes ? `${this.minutes}m` : '';
        return [hours, minutes].join(' ');
      },
    },
    isFilled: {
      deps: ['hasValue'],
      fn() {
        return this.hasValue;
      },
    },
  },

  bindings: {
    disabled: [
      { type: 'toggle', no: '[data-hook=estimate-field-add]' },
      { type: 'toggle', no: '[data-hook=estimate-field-subtract]' },
      { type: 'booleanClass', hook: 'sep', no: 'spacing-7--outer-horizontal' },
      {
        type: 'booleanClass',
        selector: '.estimate-field__input-wrapper',
        yes: 'task-form__readonly',
      },
      {
        type: 'booleanClass',
        no: 'row--bordered',
      },
    ],
    isEditing: {
      type: 'booleanClass',
      selector: '.estimate-field__input-wrapper',
      name: 'estimate-field__input-wrapper--active',
    },
    showEmpty: {
      type: 'toggle',
      hook: 'estimate-field-empty',
    },
    showInput: {
      type: 'toggle',
      hook: 'estimate-field-active',
    },
    showLabel: {
      type: 'toggle',
      hook: 'estimate-field-inactive',
    },
    label: {
      type: 'text',
      hook: 'estimate-field-inactive',
    },
    hours: {
      type: 'value',
      hook: 'estimate-field-input-hours',
    },
    minutes: {
      type: 'value',
      hook: 'estimate-field-input-minutes',
    },
    tabIndex: [
      {
        type: 'attribute',
        name: 'tabindex',
      },
      {
        type: 'attribute',
        selector: 'input',
        name: 'tabindex',
      },
    ],
  },

  initialize() {
    this.initInputVal();
  },

  initInputVal() {
    this.hours = Math.floor(this.value / 60);
    this.minutes = this.value % 60;
  },

  updateValue() {
    this.value = Number((this.hours * 60 + this.minutes).toFixed(2));
    setTimeout(() => {
      if (
        !this.isFocused('estimate-field-input-hours') &&
        !this.isFocused('estimate-field-input-minutes')
      ) {
        this.stopEditing();
      }
    }, 10);
  },

  validateHoursInput() {
    const el = this.queryByHook('estimate-field-input-hours');
    if (!el.value) {
      return;
    }

    el.value = parseInt(el.value);

    if (!(0 <= el.value && el.value <= 99)) {
      el.value = el.value.slice(0, 2);
    }
    if (el.value < 0) {
      el.value = 0;
    }
    if (el.value >= 24) {
      if (this.minutes === 0) {
        el.value = 24;
      } else {
        el.value = 23;
      }
    }

    this.onHoursUpdate();
  },

  validateMinutesInput() {
    const el = this.queryByHook('estimate-field-input-minutes');
    if (!el.value) {
      return;
    }

    el.value = parseInt(el.value);

    if (!(0 <= el.value && el.value <= 99)) {
      el.value = el.value.slice(0, 2);
    }
    if (el.value < 0) {
      el.value = 0;
    }
    if (el.value > 59) {
      el.value = 59;
    }

    this.onMinutesUpdate();
  },

  onHoursUpdate() {
    const el = this.queryByHook('estimate-field-input-hours');
    this.hours = parseInt(el.value);
    if (isNaN(this.hours) || this.hours < 0) {
      this.hours = 0;
    }
    this.updateValue();
  },

  onMinutesUpdate() {
    const el = this.queryByHook('estimate-field-input-minutes');
    this.minutes = parseInt(el.value);
    if (isNaN(this.minutes) || this.minutes < 0) {
      this.minutes = 0;
    }

    if (this.minutes !== 0 && this.hours >= 24) {
      this.hours = 23;
      this.validateHoursInput();
    }

    this.updateValue();
  },

  onAddClicked(event) {
    event.stopImmediatePropagation();
    this.hours++;
    this.validateHoursInput();
  },

  onSubtractClicked(event) {
    event.stopImmediatePropagation();
    if (this.hours === 0) {
      return;
    }
    this.hours--;
    this.validateHoursInput();
  },

  roundNumber(number) {
    return Math.round(number * 1000) / 1000;
  },

  onFocusInput(e) {
    e.target.select();
  },

  startEditing() {
    if (this.isEditing || this.disabled) {
      return;
    }
    this.isEditing = true;
    this.queryByHook('estimate-field-input-hours').focus();
  },

  stopEditing() {
    this.isEditing = false;
  },

  isFocused(hook) {
    return this.queryByHook(hook) === document.activeElement;
  },
});
