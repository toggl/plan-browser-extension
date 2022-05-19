import AmpersandView from 'ampersand-view';
import { multipleClassBinding } from 'src/utils/multiple-class-binding';
import css from './style.module.scss';
import template from './template.dot';

const Radio = AmpersandView.extend({
  template,
  css,

  props: {
    checked: ['boolean', false, false],
    className: 'string',
    label: 'string',
    name: 'string',
    value: ['any', true],
    onClick: 'any',
  },

  session: {},

  derived: {
    showLabel: {
      deps: ['label'],
      fn() {
        return !!this.label?.length;
      },
    },
  },

  events: {
    mousedown: 'handleMouseDown',
  },

  bindings: {
    showLabel: {
      type: 'toggle',
      hook: 'radio:label',
    },
    label: {
      type: 'text',
      hook: 'radio:label',
    },
    className: multipleClassBinding(),
    labelClassName: multipleClassBinding({ hook: 'radio:label' }),
    checked: [
      {
        type: 'booleanAttribute',
        name: 'checked',
        hook: 'radio:input',
      },
      {
        type: 'booleanClass',
        name: 'text--color-link-new',
        hook: 'radio:label',
      },
    ],
    name: {
      type: 'attribute',
      name: 'name',
      hook: 'radio:input',
    },
  },

  handleMouseDown(e) {
    e.preventDefault();
    this.onClick?.(this.value, e);
  },

  updateChecked(checked) {
    this.checked = checked;
  },
});

export default Radio;
