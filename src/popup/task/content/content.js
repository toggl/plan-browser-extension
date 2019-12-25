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
      prepareView(el) {
        return new ColorInput({
          el,
          disabled: !this.enableEdit,
          task: this.task,
          workspace: this.workspace,
        });
      },
    },
    nameField: {
      hook: 'name-input',
      prepareView(el) {
        return new NameInput({
          el,
          disabled: !this.enableEdit,
          task: this.task,
        });
      },
    },
    statusField: {
      hook: 'status-field',
      prepareView(el) {
        return new StatusField({
          el,
          disabled: !this.enableEdit,
          parent: this,
          task: this.task,
        });
      },
    },
    projectField: {
      hook: 'project-select',
      prepareView(el) {
        return new ProjectField({
          el,
          isEditable: this.enableEdit,
          task: this.task,
          parent: this,
        });
      },
    },
    segmentField: {
      hook: 'segment-select',
      prepareView(el) {
        return new SegmentField({
          el,
          isEditable: this.enableEdit,
          task: this.task,
          parent: this,
        });
      },
    },
    userField: {
      hook: 'user-select',
      prepareView(el) {
        return new UserField({
          el,
          isEditable: this.enableEdit,
          task: this.task,
          workspace: this.workspace,
          parent: this,
        });
      },
    },
    dateField: {
      hook: 'date-input',
      prepareView(el) {
        return new DateField({
          el,
          parent: this,
          task: this.task,
          disabled: !this.enableEdit,
          me: this.me,
        });
      },
    },
    estimateField: {
      hook: 'estimate-input',
      prepareView(el) {
        return new EstimateField({
          el,
          parent: this,
          disabled: !this.enableEdit,
          task: this.task,
        });
      },
    },
    timeField: {
      hook: 'time-input',
      prepareView(el) {
        return new TimeField({
          el,
          parent: this,
          task: this.task,
          disabled: !this.enableEdit,
          me: this.me,
        });
      },
    },
  },
});

export default TaskView;
