import _ from 'lodash';
import hub from 'src/popup/utils/hub';
import View from '../select_field_popup';

import TagView from './tag_item';
import Popup from './popup';
import template from './template.dot';
import css from './style.module.scss';
import './style.scss';

const SelectField = View.extend({
  template,
  css,

  props: {
    heading: ['string', true, 'Tags'],
    headingIconClass: ['string', true, css.icon],
    labelName: ['string', true, 'Tags'],
    tabIndex: ['number', true, 5],
    isEditable: 'boolean',
    task: ['state', true],
    parent: ['state', true],
    workspace: ['state', true],
  },

  bindings: {
    heading: {
      type: 'text',
      hook: 'heading-label',
    },
    headingIconClass: {
      type: 'class',
      hook: 'heading-icon',
    },
    isEditable: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      no: 'task-form__field-input-container--readonly',
    },
    'task.tagsSize.length': [
      {
        type: 'toggle',
        hook: 'input-placeholder',
        invert: true,
      },
    ],
  },

  derived: {
    canRemove: {
      deps: [],
      fn() {
        return true;
      },
    },
  },

  events: {
    'focus [data-hook=input]': 'startEditing',
    'keydown [data-hook=input]': 'onKeyDown',
  },

  initialize() {
    _.bindAll(this, 'onComputedProjectChange');

    this.labelName = this.labelName || this.heading;
    this.listenToOnce(
      hub,
      'task-form:close-users-popup',
      () => this.popup && this.popup.close()
    );
    this.listenToAndRun(
      this.task,
      'change:computedProject',
      this.onComputedProjectChange
    );
  },

  render() {
    this.renderWithTemplate();
    this.renderCollection(this.task.tags, TagView, this.queryByHook('tags'));
  },

  onComputedProjectChange() {
    this.task.computedProject?.loadTags();
  },

  startEditing(event) {
    event.preventDefault();

    this.stopEditing();

    if (!this.isEditable || !this.task.computedProject) {
      return;
    }

    this.popup = this.registerPopup(new Popup({ parent: this }));

    hub.trigger('popups:show', {
      name: 'task-form-select-field-popup',
      content: this.popup,
      direction: 'up',
      modifiers: ['rounded'],
      hideArrow: true,
      overlay: {
        closeOnClick: true,
        transparent: true,
      },
      positioning: {
        anchor: $(this.queryByHook('input')),
        position: 'center',
        alignments: ['top', 'bottom'],
      },
    });
  },

  onKeyDown(event) {
    switch (event.keyCode || event.which) {
      // case 9:
      //   this.stopEditing();
      //   break;
      case 37:
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      // case 38:
      //   event.preventDefault();
      //   this.popup.goUp();
      //   break;
      // case 40:
      //   event.preventDefault();
      //   this.popup.goDown();
      //   break;
      // case 13:
      //   event.preventDefault();
      //   event.stopPropagation();
      //   this.popup.useSelected();
      //   break;
    }
  },

  remove() {
    this.stopEditing();
    View.prototype.remove.call(this);
  },
});

export default (parent, props) => new SelectField({ ...props, parent });
