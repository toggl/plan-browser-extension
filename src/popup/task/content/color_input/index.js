import View from 'ampersand-view';
import hub from 'src/popup/utils/hub';
import ColorPopup from './color_popup/color_popup';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    disabled: ['boolean', false, true],
    task: ['state', true],
    colorId: 'number',
    workspace: 'state',
  },

  derived: {
    colorClass: {
      deps: ['colorId'],
      fn() {
        return `color-${this.colorId}`;
      },
    },
  },

  bindings: {
    colorClass: {
      type: 'class',
    },
    colorId: {
      type: 'attribute',
      name: 'data-color-id',
    },
    disabled: [
      { type: 'booleanClass', name: 'button--disabled' },
      { selector: '.icon-svg', type: 'toggle', invert: true },
    ],
  },

  events: {
    click: 'openColorPicker',
  },

  initialize() {
    this.colorId = 22;
  },

  openColorPicker(event) {
    event.preventDefault();

    if (this.disabled) {
      return;
    }

    const popup = new ColorPopup({
      selected: this.colorId,
      workspace: this.workspace,
    });
    this.listenTo(popup, 'select', this.updateColor);

    hub.trigger('popups:show', {
      content: popup,
      direction: 'up',
      modifiers: ['rounded'],
      overlay: {
        closeOnClick: true,
        transparent: true,
      },
      positioning: {
        anchor: this.queryByHook('button-color'),
        position: 'down',
        distance: 10,
        alignments: ['center', 'right', 'left'],
      },
    });
  },

  updateColor(color_id) {
    this.colorId = color_id;
    this.parent.saveTask({ color_id });
  },
});
