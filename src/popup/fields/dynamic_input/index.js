import { isEmpty } from 'lodash';
import View from 'ampersand-view';
import template from './template.dot';
import './style.scss';

/*
Dynamic input has a text placeholder that will show instead of the input when
the input is not focused. When the placeholder is clicked or the input gains
focus (because the user switches to it with tab) the placeholder is hidden and
the input is shown. The input will have the same width as the placeholder
(that's why it's dynamic)
*/

const DynamicInput = View.extend({
  template,

  props: {
    id: 'string',
    name: 'string',
    type: ['string', true, 'text'],
    placeholder: 'string',
    className: 'string',
    value: 'string',
    disabled: 'boolean',
    showArrow: 'boolean',
  },

  session: {
    focus: 'boolean',
  },

  derived: {
    hasValue: {
      deps: ['value'],
      fn() {
        return !isEmpty(this.value);
      },
    },
    labelText: {
      deps: ['placeholder', 'value', 'hasValue'],
      fn() {
        return this.hasValue ? this.value : this.placeholder;
      },
    },
  },

  bindings: {
    id: { type: 'attribute', hook: 'dynamic-input-control', name: 'id' },
    name: [
      { type: 'attribute', name: 'data-dynamic-input' },
      { type: 'attribute', hook: 'dynamic-input-control', name: 'name' },
    ],
    type: { type: 'attribute', hook: 'dynamic-input-control', name: 'type' },
    placeholder: {
      type: 'attribute',
      hook: 'dynamic-input-control',
      name: 'placeholder',
    },
    className: { type: 'class', hook: 'dynamic-input-control' },
    value: {
      hook: 'dynamic-input-control',
      type(el, value) {
        if (value) {
          if (el.value !== value) {
            el.value = value;
          }
        } else {
          el.value = '';
        }
      },
    },
    disabled: {
      type: 'booleanAttribute',
      name: 'readonly',
      hook: 'dynamic-input-control',
    },
    focus: { type: 'booleanClass', name: 'dynamic-input--focus' },
    labelText: { type: 'text', hook: 'dynamic-input-label' },
    hasValue: { type: 'booleanClass', no: 'dynamic-input--empty' },
    showArrow: { type: 'toggle', hook: 'arrow' },
  },

  events: {
    click: 'onClick',
    'input [data-hook=dynamic-input-control]': 'onInputChange',
    'focus [data-hook=dynamic-input-control]': 'onInputFocus',
    'blur [data-hook=dynamic-input-control]': 'onInputBlur',
  },

  initialize() {
    this.id = `dynamic-input-${this.cid}`;
  },

  render() {
    this.renderWithTemplate();

    this.cacheElements({
      inputEl: 'input',
    });
  },

  focusInput() {
    this.inputEl.focus();
  },

  onClick() {
    this.trigger('click');
  },

  onInputChange() {
    this.value = this.inputEl.value;
  },

  onInputFocus() {
    this.focus = true;
    this.trigger('focus');
  },

  onInputBlur() {
    this.trigger('update', this.value);

    this.focus = false;
    this.trigger('blur');
  },
});

export default DynamicInput;
