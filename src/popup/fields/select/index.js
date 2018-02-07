const View = require('ampersand-view');
const template = require('./template.hbs');

module.exports = View.extend({

  template,

  props: {
    name: ['string', true],
    placeholder: 'string',
    label: ['string', true],
    value: 'string',
    infoText: ['string', true, ''],
    errorText: ['string', true, ''],
    errorLabel: 'string',
    isValid: ['boolean', true, false],
    isActive: ['boolean', true, false],
    isDirty: ['boolean', true, false],
    options: ['string', true], // HTML string of <options> for select
    modifiers: ['array', true, () => []],
    validations: ['array', true, () => []],
    tabIndex: 'number',
  },

  derived: {
    modifierClasses: {
      deps: ['modifiers', 'modifiers.length'],
      fn() {
        return this.modifiers.reduce((modClass, modifier) => {
          return `${modClass} control-group--${modifier}`;
        }, '').trim();
      }
    },

    showError: {
      deps: ['isValid', 'isDirty', 'errorText'],
      fn() {
        return this.errorText && !this.isValid && this.isDirty;
      }
    },

    formattedLabel: {
      deps: ['label'],
      fn() {
        return this.label ? `${this.label}: ` : '';
      }
    },

    isInline: {
      deps: ['modifiers'],
      fn() {
        return this.modifiers && this.modifiers.indexOf('inline') !== -1;
      }
    }
  },

  bindings: {
    formattedLabel: [{
      type: 'toggle',
      hook: 'label'
    }, {
      type: 'text',
      hook: 'label'
    }],

    placeholder: {
      type: 'text',
      hook: 'placeholder'
    },

    name: {
      type: 'attribute',
      hook: 'select',
      name: 'name',
    },

    modifierClasses: {
      type: 'class',
    },

    errorLabel: {
      type: 'attribute',
      name: 'data-err'
    },

    isInline: {
      type: 'booleanClass',
      yes: 'icon-new-chevron-light',
      no: 'icon-new-chevron-link',
      hook: 'select',
    },

    errorText: [{
      type: 'text',
      hook: 'error-text',
    }, {
      type: 'toggle',
      hook: 'error-text',
    }, {
      type: 'toggle',
      hook: 'info-text',
      invert: true,
    }],

    infoText: {
      type: 'text',
      hook: 'info-text',
    },

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
      hook: 'select',
      name: 'tabindex'
    }
  },

  events: {
    'focus [data-hook=select]': 'onFocus',
    'blur [data-hook=select]': 'onBlur',
    'change [data-hook=select]': 'onChange',
  },

  initialize() {
    this.listenTo(this, 'error', (errorText) => {
      this.errorText = errorText;
      this.isValid = false;
      this.isDirty = true;
    });

    this.listenTo(this, 'change:value', () => this.onValueChange());
  },

  render() {
    this.renderWithTemplate();
    this.cacheElements({
      selectElement: '[data-hook=select]'
    });

    if (this.value) {
      this.onValueChange();
    }
  },

  setValue(value) {
    const { selectElement } = this;
    if (selectElement) {
      this.value = value;
      selectElement.value = value;
    }
  },

  onBlur() {
    this.isActive = false;
    this.trigger('blur');
  },

  onFocus() {
    this.isActive = true;
    this.trigger('focus');
  },

  onChange(event) {
    this.value = event.target.value;
  },

  onValueChange() {
    const { selectElement } = this;
    if (selectElement) {
      selectElement.value = this.value;
    }

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
        this.errorText = validation.message || "*Choose an option";
        this.isValid = false;
        return;
      }

      i++;
    }

    this.isValid = true;
    this.errorText = '';
  },
});
