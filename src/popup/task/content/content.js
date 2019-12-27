import View from 'ampersand-view';
import NameInput from './name_input';
import ColorInput from './color_input';
import StatusField from './status_field';
import ProjectField from './project_field';
import SegmentField from './segment_field';
import UserField from './user_field';
import DateField from './date_field';
import EstimateField from './estimate_field';
import TimeField from './time_field';
import css from './content.module.scss';
import template from './content.dot';

const TaskView = View.extend({
  template,
  css,

  props: {
    workspace: 'state',
    me: 'object',
    enableEdit: 'boolean',
    task: 'state',
  },

  subviews: {
    colorField: {
      hook: 'color-input',
      prepareView() {
        return new ColorInput({
          disabled: !this.enableEdit,
          task: this.task,
          workspace: this.workspace,
        });
      },
    },
    nameField: {
      hook: 'name-input',
      prepareView() {
        return new NameInput({
          disabled: !this.enableEdit,
          task: this.task,
        });
      },
    },
    statusField: {
      hook: 'status-field',
      prepareView() {
        return new StatusField({
          disabled: !this.enableEdit,
          parent: this,
          task: this.task,
        });
      },
    },
    projectField: {
      hook: 'project-select',
      prepareView() {
        return new ProjectField({
          isEditable: this.enableEdit,
          task: this.task,
          parent: this,
        });
      },
    },
    segmentField: {
      hook: 'segment-select',
      prepareView() {
        return new SegmentField({
          isEditable: this.enableEdit,
          task: this.task,
          parent: this,
        });
      },
    },
    userField: {
      hook: 'user-select',
      prepareView() {
        return new UserField({
          isEditable: this.enableEdit,
          task: this.task,
          workspace: this.workspace,
          parent: this,
        });
      },
    },
    dateField: {
      hook: 'date-input',
      prepareView() {
        return new DateField({
          parent: this,
          task: this.task,
          disabled: !this.enableEdit,
          me: this.me,
        });
      },
    },
    estimateField: {
      hook: 'estimate-input',
      prepareView() {
        return new EstimateField({
          parent: this,
          disabled: !this.enableEdit,
          task: this.task,
        });
      },
    },
    timeField: {
      hook: 'time-input',
      prepareView() {
        return new TimeField({
          parent: this,
          task: this.task,
          disabled: !this.enableEdit,
          me: this.me,
        });
      },
    },
  },

  render() {
    this.renderWithTemplate(this);
    this.focusFirstInput();
  },

  focusFirstInput() {
    if (this.enableEdit) {
      setTimeout(() => this.nameField.el.focus(), 100);
    }
  },
});

export default TaskView;
