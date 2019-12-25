import View from 'ampersand-view';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    parent: ['object', true],
    task: 'state',
  },

  derived: {
    statusLabel: {
      deps: ['task.done'],
      fn() {
        return this.task.done ? 'Done' : 'In Progress';
      },
    },
    otherStatusLabel: {
      deps: ['task.done'],
      fn() {
        return !this.task.done ? 'Done' : 'In Progress';
      },
    },
  },

  bindings: {
    statusLabel: {
      type: 'text',
      hook: 'status-label',
    },
    otherStatusLabel: {
      type: 'text',
      hook: 'other-status-label',
    },
    'task.done': [
      {
        type: 'booleanClass',
        hook: 'status-label',
        yes: css.done,
        no: css.undone,
      },
      {
        type: 'booleanClass',
        hook: 'other-status-label',
        yes: css.undone,
        no: css.done,
      },
    ],
  },

  events: {
    'click [data-hook=other-status]': 'toggleDone',
  },

  close() {
    this.trigger('close');
  },

  toggleDone(event) {
    event.preventDefault();
    this.task.toggle('done');
    this.close();
  },
});
