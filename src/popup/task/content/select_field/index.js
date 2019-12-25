import _ from 'lodash';
import View from '../select_field_popup';
import hub from 'src/popup/utils/hub';
import Popup from './popup';
import template from './template.dot';
import './style.scss';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    heading: ['string', true],
    headingIconClass: ['string', true],
    isEditable: 'boolean',
    canRemove: 'boolean',
    task: ['state', true],
    modelIdProp: ['string', true],
    selectedModel: 'state',
    iconView: ['any', true],
    getCollectionItems: ['any', true],
    labelName: ['string', true],
    addButtonlabel: ['string', true],
    addModel: ['any', true],
    saveTask: ['any', true],
    parent: ['any', true],
    tabIndex: ['number', true],
  },

  bindings: {
    'selectedModel.name': [
      {
        type: 'text',
        hook: 'input-label',
      },
      {
        type: 'toggle',
        hook: 'input-placeholder',
        invert: true,
      },
    ],
    iconClass: {
      type: 'class',
      hook: 'input-icon',
    },
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
  },

  subviews: {
    icon: {
      hook: 'input-icon',
      prepareView(el) {
        const { selectedModel: model } = this;
        return new this.iconView({ model, el });
      },
    },
  },

  events: {
    // 'click [data-hook=input]': 'startEditing',
    'focus [data-hook=input]': 'startEditing',
    'keydown [data-hook=input]': 'onKeyDown',
  },

  initialize() {
    this.labelName = this.labelName || this.heading;
    this.listenToAndRun(this, `change:task.${this.modelIdProp}`, () =>
      this.setSelectedModel()
    );
    this.listenTo(
      this,
      'change:selectedModel',
      () => (this.icon.model = this.selectedModel)
    );
  },

  setSelectedModel() {
    this.selectedModel = !this.task
      ? null
      : _.find(this.getCollectionItems(), {
          id: this.task[this.modelIdProp],
        });
  },

  startEditing(event) {
    event.preventDefault();

    this.stopEditing();

    if (!this.isEditable) {
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
        anchor: this.queryByHook('input'),
        position: 'center',
        alignments: ['top', 'bottom'],
      },
    });
  },

  onKeyDown(event) {
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
        this.popup.goUp();
        break;
      case 40:
        event.preventDefault();
        this.popup.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.popup.useSelected();
        break;
    }
  },
});
