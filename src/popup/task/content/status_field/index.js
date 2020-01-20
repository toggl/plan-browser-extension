import View from '../select_field_popup';
import Popup from './popup';
import hub from 'src/popup/utils/hub';
import template from './template.dot';
import css from './style.module.scss';
import './style.scss';

export default View.extend({
  template,
  css,

  props: {
    task: 'state',
    show: 'boolean',
    disabled: 'boolean',
  },

  derived: {
    statusLabel: {
      deps: ['task.done'],
      fn() {
        return this.task.done ? 'Done' : 'In Progress';
      },
    },
    canToggle: {
      deps: ['disabled'],
      fn() {
        return !this.disabled;
      },
    },
  },

  bindings: {
    statusLabel: {
      type: 'text',
      hook: 'input-label',
    },
    'task.done': {
      type: 'booleanClass',
      hook: 'input-label',
      yes: css.done,
      no: css.undone,
    },
    canToggle: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      no: 'task-form__field-input-container--readonly',
    },
  },

  events: {
    // 'click [data-hook=input]': 'startEditing',
    'focus [data-hook=input]': 'startEditing',
    'keydown [data-hook=input]': 'onKeyDown',
  },

  startEditing(event) {
    event.preventDefault();

    this.stopEditing();

    if (!this.canToggle) {
      return;
    }

    this.popup = this.registerPopup(
      new Popup({ parent: this, task: this.task })
    );

    hub.trigger('popups:show', {
      name: 'status-dropdown-popup',
      content: this.popup,
      direction: 'up',
      modifiers: ['rounded'],
      hideArrow: true,
      overlay: {
        closeOnClick: true,
        transparent: true,
      },
      positioning: {
        anchor: this.queryByHook('input'),
        position: 'center',
        alignments: ['top', 'bottom'],
      },
    });
  },

  onKeyDown(event) {
    const otherStatus = this.popup.queryByHook('other-status');

    switch (event.keyCode || event.which) {
      case 9:
        this.stopEditing();
        break;
      case 37:
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      case 38:
        event.preventDefault();
        otherStatus.classList.add('active');
        break;
      case 40:
        event.preventDefault();
        otherStatus.classList.add('active');
        break;
      case 13:
        event.stopPropagation();
        this.popup.toggleDone();
        break;
    }
  },
});
