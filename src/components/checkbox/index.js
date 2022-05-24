import AmpersandView from 'ampersand-view';
import Mousetrap from 'mousetrap';
import css from './style.module.scss';
import template from './template.dot';

const Checkbox = AmpersandView.extend({
  template,
  css,

  props: {
    label: 'string',
    labelClassname: 'string',
    value: ['boolean', true, false],
    disabled: ['boolean', true, false],
    size: ['number', true, 24],
    focusable: ['boolean', true, false],
    transparent: ['boolean', false, false],
    uncheckOnDisabled: ['boolean', false, false],
    onChange: ['any'],
  },

  derived: {
    sizeClass: {
      deps: ['size'],
      fn() {
        return css[`size-${this.size}`];
      },
    },
  },

  bindings: {
    label: [
      {
        type: 'text',
        hook: 'label',
      },
      {
        type: 'toggle',
        hook: 'label',
      },
    ],
    labelClassname: {
      type(el, value, previousValue) {
        if (previousValue?.length) {
          el.classList.remove(...(previousValue?.split(' ') ?? []));
        }

        el.classList.add(...(value?.split(' ') ?? []));
      },
      hook: 'label',
    },
    value: [
      {
        type: 'booleanClass',
        hook: 'checkbox',
        name: css.checked,
      },
      {
        type(el, value) {
          el.setAttribute('data-checked', value ? 'on' : 'off');
        },
        hook: 'animated-checkbox',
      },
    ],
    disabled: [
      {
        type: 'booleanClass',
        name: css.disabled,
      },
    ],
    sizeClass: {
      type: 'class',
      hook: 'checkbox',
    },
    focusable: {
      type: 'switchAttribute',
      hook: 'checkbox',
      name: 'tabindex',
      cases: {
        true: '0',
        false: '',
      },
    },
    transparent: {
      type: 'booleanClass',
      hook: 'checkbox',
      name: css.transparent,
    },
  },

  events: {
    click: 'onToggle',
    'focus [data-hook="checkbox"]': 'bindKeyPress',
    'blur [data-hook="checkbox"]': 'unbindKeyPress',
  },

  initialize() {
    this.listenTo(this, 'change:disabled', () => {
      if (this.uncheckOnDisabled) {
        this.value = false;
      }
    });
  },

  bindKeyPress() {
    this.focusable &&
      Mousetrap.bind(['space', 'return'], this.onToggle.bind(this));
  },

  unbindKeyPress() {
    this.focusable && Mousetrap.unbind(['space', 'return']);
  },

  onToggle(event) {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    this.value = !this.value;
    this.onChange?.(this.value);
  },

  updateProps(props = {}) {
    this.disabled = props.disabled ?? this.disabled;
    this.value = props.value ?? this.value;
  },
});

export default Checkbox;
