import View from 'ampersand-view';
import template from './template.hbs';

let labelKey = 1;
function getInputID() {
  return `form-input${labelKey++}`;
}

export default View.extend({
  template,

  props: {
    name: ['string', true],
    placeholder: ['string', true, 'Enter input...'],
    autofocus: 'boolean',
    disabled: 'boolean',
    maxlength: 'number',
    id: 'string',
    type: ['string', true, 'text'],
    label: 'string',
    value: ['string', true, ''],
    isDirty: ['boolean', true, false],
    isActive: ['boolean', true, false],
    isValid: ['boolean', true, false],
    errorText: ['string', true, ''],
    infoText: ['string', true, ''],
    validations: ['array', true, () => []],
    tabIndex: 'number',
  },

  derived: {
    showError: {
      deps: ['isValid', 'isDirty', 'errorText'],
      fn() {
        return this.errorText && !this.isValid && this.isDirty;
      },
    },

    formattedLabel: {
      deps: ['label'],
      fn() {
        return this.label || '';
      },
    },

    isFilled: {
      deps: ['value'],
      fn() {
        return this.value && this.value.length > 0;
      },
    },
  },

  bindings: {
    name: {
      type: 'attribute',
      hook: 'input',
      name: 'name',
    },

    id: [
      {
        type: 'attribute',
        hook: 'label',
        name: 'for',
      },
      {
        type: 'attribute',
        hook: 'input',
        name: 'id',
      },
    ],

    type: {
      type: 'attribute',
      hook: 'input',
      name: 'type',
    },

    placeholder: {
      type: 'attribute',
      hook: 'input',
      name: 'placeholder',
    },

    maxlength: {
      type: 'attribute',
      hook: 'input',
      name: 'maxlength',
    },

    disabled: {
      type: 'booleanAttribute',
      hook: 'input',
      name: 'disabled',
    },

    autofocus: {
      type: 'booleanAttribute',
      hook: 'input',
      name: 'autofocus',
    },

    value: {
      type: 'value',
      hook: 'input',
    },

    formattedLabel: [
      {
        type: 'toggle',
        hook: 'label',
      },
      {
        type: 'text',
        hook: 'label',
      },
    ],

    errorText: [
      {
        type: 'text',
        hook: 'error-text',
      },
      {
        type: 'toggle',
        hook: 'info-text',
        invert: true,
      },
    ],

    infoText: [
      {
        type: 'text',
        hook: 'info-text',
      },
      {
        type: 'toggle',
        hook: 'info-text',
      },
    ],

    isActive: {
      type: 'booleanClass',
      hook: 'control',
      name: 'control-group__control--active',
    },

    showError: {
      type: 'booleanClass',
      hook: 'control',
      yes: 'control-group__control--error',
    },

    tabIndex: {
      type: 'attribute',
      hook: 'input',
      name: 'tabindex',
    },
  },

  events: {
    'input [data-hook=input]': 'onInputChange',
    'blur [data-hook=input]': 'onInputBlur',
    'focus [data-hook=input]': 'onInputFocus',
  },

  initialize() {
    this.id = getInputID();
    this.listenTo(this, 'focus', () => {
      this.input && this.input.focus();
    });

    this.listenTo(this, 'error', errorText => {
      this.isValid = false;
      this.errorText = errorText;
      this.isDirty = true;
    });

    this.listenTo(this, 'change:value', () => this.onValueChange());

    if (this.value) {
      this.onValueChange();
    }
  },

  render() {
    this.renderWithTemplate();
    this.cacheElements({
      input: '[data-hook=input]',
    });
  },

  onInputChange(event) {
    this.value = event.target.value;
  },

  onInputBlur() {
    this.isActive = false;
    this.trigger('blur');
  },

  onInputFocus() {
    this.isActive = true;
    this.trigger('focus');
  },

  onValueChange() {
    if (this.value && !this.isDirty) {
      this.isDirty = true;
    }

    this.validate();
  },

  validate() {
    const { validations, value } = this;

    let i = 0;
    let isValid = true;
    while (i < validations.length) {
      const validation = validations[i];
      isValid = isValid && validation.run(value);

      if (!isValid) {
        this.errorText = validation.message || '*Input is not valid';
        this.isValid = false;
        return;
      }

      i++;
    }

    this.isValid = true;
    this.errorText = '';
  },

  reset(value = '') {
    this.value = value;
    this.isDirty = false;
    this.isValid = false;
  },

  focus() {
    this.input.setSelectionRange(0, this.value.length);
    this.input.focus();
  },
});
