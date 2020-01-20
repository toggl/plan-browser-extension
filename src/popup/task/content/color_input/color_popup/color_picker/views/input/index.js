import _ from 'lodash';
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
    isReadOnly: ['boolean', true, false],
    errorText: ['string', true, ''],
    infoText: ['string', true, ''],
    validations: ['array', true, () => []],
    modifiers: ['array', true, () => []],
    normalise: ['any'],
    onKeyDown: ['any'],
  },

  derived: {
    modifierClasses: {
      deps: ['modifiers'],
      fn() {
        return this.modifiers
          .reduce((modClass, modifier) => {
            return `${modClass} control-group--${modifier}`;
          }, '')
          .trim();
      },
    },

    showError: {
      deps: ['isValid', 'isDirty', 'errorText'],
      fn() {
        return this.errorText && !this.isValid && this.isDirty;
      },
    },

    showInfo: {
      deps: ['showError', 'infoText'],
      fn() {
        return !this.showError && this.infoText;
      },
    },

    formattedLabel: {
      deps: ['label', 'modifiers'],
      fn() {
        const shouldIncludeColon = this.modifiers.indexOf('external-label') < 0;
        return this.label
          ? `${this.label}${shouldIncludeColon ? ':' : ''} `
          : '';
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

    errorText: {
      type: 'text',
      hook: 'error-text',
    },

    showInfo: {
      type: 'toggle',
      hook: 'info-text',
    },

    infoText: {
      type: 'text',
      hook: 'info-text',
    },

    isActive: {
      type: 'booleanClass',
      hook: 'control',
      name: 'control-group__control--active',
    },

    isReadOnly: [
      {
        type: 'booleanClass',
        hook: 'control',
        name: 'control-group__control--read-only',
      },
      {
        type: 'booleanAttribute',
        hook: 'input',
        name: 'readonly',
      },
    ],

    showError: [
      {
        type: 'booleanClass',
        hook: 'control',
        yes: 'control-group__control--error',
      },
      {
        type: 'toggle',
        hook: 'error-text',
      },
    ],

    modifierClasses: {
      type: 'class',
    },
  },

  events: {
    'click [data-hook=control]': 'onControlClick',
    'keydown [data-hook=input]': 'keyDown',
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
    this.listenTo(this, 'change:validations', () => this.validate());

    if (this.value) {
      this.onValueChange();
    }
  },

  render() {
    this.renderWithTemplate();
    this.cacheElements({
      input: '[data-hook=input]',
      control: '[data-hook=control]',
    });
  },

  keyDown(event) {
    const { onKeyDown } = this;
    if (_.isFunction(onKeyDown)) {
      onKeyDown(event);
    }
  },

  onControlClick(event) {
    if (event.target === this.control) {
      this.input.focus();
    }
  },

  onInputChange(event) {
    const normalise = _.get(this, 'normalise', _.identity);
    const value = _.get(event, 'target.value');

    this.value = normalise(value);
    if (this.value !== value) {
      this.input.value = this.value;
    }
    this.trigger('input');
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
    const input = this.queryByHook('input');
    const resetValue = () => {
      this.value = value;
      this.isDirty = false;
      this.isValid = false;
    };

    if (document.activeElement === input) {
      //https://github.com/AmpersandJS/ampersand-dom-bindings#value
      input.blur();
      _.defer(() => {
        resetValue();
        input.focus();
      });
    } else {
      resetValue();
    }
  },
});
