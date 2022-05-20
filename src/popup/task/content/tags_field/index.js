import FilteredCollection from 'ampersand-filtered-subcollection';
import CollectionSize from 'src/popup/utils/collection_size';
import hub from 'src/popup/utils/hub';
import View from '../select_field_popup';
import { TagOptions } from './models';
import Popup from './popup';
import css from './style.module.scss';
import TagView from './tag';
import template from './template.dot';

export default View.extend({
  template,
  css,

  props: {
    tabIndex: ['number', true, 5],
    isEditable: 'boolean',
    task: ['state', true],
    workspace: 'state',
    parent: ['state', true],
  },

  session: {
    selected: 'any',
    selectedSize: 'any',
  },

  bindings: {
    isEditable: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      no: 'task-form__field-input-container--readonly',
    },
    'task.tag_ids.length': [
      {
        type: 'toggle',
        hook: 'input-placeholder',
        invert: true,
      },
    ],
  },

  events: {
    'focus [data-hook=input]': 'startEditing',
    'keydown [data-hook=input]': 'onKeyDown',
  },

  initialize() {
    this.setSessionVariables();
    this.addEventListeners();
  },

  setSessionVariables() {
    this.options = new TagOptions(this.workspace, this.task);
    this.selected = new FilteredCollection(this.options, {
      filter: model => {
        return this.task.tag_ids.includes(model.id);
      },
      comparator: model => {
        return this.task.tag_ids.indexOf(model.id);
      },
    });
    this.selectedSize = new CollectionSize(this.selected);
  },

  addEventListeners() {
    this.listenToAndRun(this.task, 'change:tag_ids', () => {
      this.selected?._runFilters();
    });
    this.listenTo(this.task, 'change:plan_id', () => {
      this.task.tag_ids = [];
    });
  },

  render() {
    this.renderWithTemplate();
    this.renderCollection(this.selected, TagView, this.queryByHook('tags'));
  },

  startEditing(event) {
    event.preventDefault();

    this.stopEditing();

    if (!this.isEditable) {
      return;
    }

    const { task, workspace, selected, options } = this;

    this.popup = this.registerPopup(
      new Popup({
        task,
        workspace,
        selected,
        options,
        parent: this,
      })
    );

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
