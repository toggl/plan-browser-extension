import hub from 'src/popup/utils/hub';
import { MINUTES_IN_AN_HOUR } from 'src/utils/datetime';
import { toTitleCase } from 'src/utils/to-title-case';
import View from '../select_field_popup';
import Popup from './popup';
import css from './style.module.scss';
import './style.scss';
import template from './template.dot';

export default View.extend({
  template,
  css,

  props: {
    task: ['state', true],
    me: ['object', true],
    disabled: 'boolean',
  },

  derived: {
    estimateExists: {
      deps: ['task.estimated_minutes'],
      fn() {
        return !!this.task.estimated_minutes;
      },
    },
    estimateLabel: {
      deps: [
        'estimateExists',
        'task.estimated_minutes',
        'task.estimate_type',
        'task.estimate_skips_weekend',
      ],
      fn() {
        if (!this.estimateExists) {
          return 'Define...';
        }

        const estimated_minutes = this.task.estimatedMinutes();
        const hours = Math.floor(estimated_minutes / MINUTES_IN_AN_HOUR);
        const minutes = estimated_minutes % MINUTES_IN_AN_HOUR;
        const summary = [];

        if (hours) {
          summary.push(`${hours}h`);
        }

        if (minutes) {
          summary.push(`${minutes}m`);
        }

        summary.push(toTitleCase(this.task.estimate_type ?? 'daily'));

        if (this.task.estimate_skips_weekend) {
          summary.push('WD');
        }

        return summary.join(' ');
      },
    },
  },

  bindings: {
    disabled: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      yes: 'task-form__field-input-container--readonly',
    },
    estimateLabel: {
      type: 'text',
      hook: 'estimate-input',
    },
    estimateExists: {
      type: 'booleanClass',
      hook: 'estimate-input',
      name: css.placeholder,
      invert: true,
    },
  },

  events: {
    'click [data-hook=input]': 'startEditing',
    'focus [data-hook=input]': 'startEditing',
  },

  render() {
    this.renderWithTemplate();
  },

  startEditing(event) {
    event.preventDefault();

    this.stopEditing();

    if (this.disabled) {
      return;
    }

    this.popup = this.registerPopup(
      new Popup({
        parent: this,
        task: this.task,
        me: this.me,
      })
    );

    hub.trigger('popups:show', {
      name: 'task-form-estimate-field-popup',
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
        position: 'down',
        alignments: ['left'],
      },
    });
  },
});
