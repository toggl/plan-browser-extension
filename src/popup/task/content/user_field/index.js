import _ from 'lodash';
import View from '../select_field_popup';
import hub from 'src/popup/utils/hub';
import Popup from './popup';
import CollectionSize from 'src/popup/utils/collection_size';
import { TaskMembers } from './popup/models';
import UserView from './tag_item';
import template from './template.dot';
import './style.scss';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    heading: ['string', true, 'Assignee'],
    headingIconClass: ['string', true, css.icon],
    labelName: ['string', true, 'Assignee'],
    addButtonlabel: ['string', true, '+Invite'],
    tabIndex: ['number', true, 5],
    isEditable: 'boolean',
    task: ['state', true],
    workspace: 'state',
    parent: ['state', true],
    members: 'object',
    membersCollectionSize: 'state',
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
    'task.workspace_members.length': [
      {
        type: 'toggle',
        hook: 'input-placeholder',
        invert: true,
      },
    ],
  },

  derived: {
    canRemove: {
      deps: ['task.project_id', 'task.workspace_members.length'],
      fn() {
        const taskHasProject = !_.isNil(this.task.project_id);
        const taskHasManyMembers = 1 < this.task.workspace_members.length;
        return taskHasProject || taskHasManyMembers;
      },
    },
  },

  events: {
    'focus [data-hook=input]': 'startEditing',
    'keydown [data-hook=input]': 'onKeyDown',
  },

  initialize() {
    this.labelName = this.labelName || this.heading;
    this.members = new TaskMembers(this.task, this.parent.workspace.users);
    this.membersCollectionSize = new CollectionSize(this.members);
    this.listenToOnce(
      hub,
      'task-form:close-users-popup',
      () => this.popup && this.popup.close()
    );
  },

  render() {
    this.renderWithTemplate();
    this.renderCollection(this.members, UserView, this.queryByHook('tags'));
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
