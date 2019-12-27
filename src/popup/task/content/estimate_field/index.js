import View from 'ampersand-view';
import EstimateField from 'src/popup/fields/estimate_field/estimate_field';
import template from './template.dot';
import css from './style.module.scss';
import './style.scss';

export default View.extend({
  template,
  css,

  props: {
    task: ['state', true],
    disabled: 'boolean',
  },

  bindings: {
    disabled: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      yes: 'task-form__field-input-container--readonly',
    },
  },

  subviews: {
    estimateField: {
      hook: 'estimate-input',
      prepareView() {
        const { disabled, task } = this;
        return new EstimateField({
          disabled,
          value: task.estimated_minutes || 0,
        });
      },
    },
  },

  events: {
    'click [data-hook=input]': 'startEditing',
    'focus [data-hook=input]': 'startEditing',
  },

  render() {
    this.renderWithTemplate();
    this.listenTo(this.estimateField, 'change:value', this.updateEstimate);
  },

  updateEstimate() {
    this.parent.task.set({ estimated_minutes: this.estimateField.value });
  },

  updateElValue() {
    this.estimateField.value = this.task.estimated_minutes || 0;
  },

  startEditing() {
    this.estimateField.startEditing();
  },
});
