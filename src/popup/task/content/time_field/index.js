import View from 'ampersand-view';
import Timepicker from 'src/popup/fields/timepicker/timepicker';
import moment from 'moment';
import instadate from 'instadate';
import template from './template.dot';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  props: {
    task: ['state', true],
    disabled: 'boolean',
    me: ['object', true],
  },

  bindings: {
    disabled: {
      type: 'booleanClass',
      selector: '.task-form__field-input-container',
      yes: 'task-form__field-input-container--readonly',
    },
  },

  subviews: {
    startTime: {
      hook: 'input-start-time',
      prepareView() {
        const { disabled, task, me } = this;
        return new Timepicker({
          name: 'search_start_time',
          time: task.start_time,
          disabled,
          placeholder: 'Select start time',
          me,
        });
      },
    },
    endTime: {
      hook: 'input-end-time',
      prepareView() {
        const { disabled, task, me } = this;
        return new Timepicker({
          name: 'search_end_time',
          time: task.end_time,
          disabled,
          placeholder: 'Select end time',
          me,
        });
      },
    },
  },

  events: {
    'focus [data-hook=input-start-time]': 'onFocusOnStartTime',
    'focus [data-hook=input-end-time]': 'onFocusOnEndTime',
    'keydown [data-hook=input-start-time]': 'onKeyDownOnStartTime',
    'keydown [data-hook=input-end-time]': 'onKeyDownOnEndTime',
  },

  render() {
    this.renderWithTemplate();
    this.listenTo(this.startTime, 'change:time', this.updateTimes);
    this.listenTo(this.endTime, 'change:time', this.updateTimes);
  },

  updateTimes(e) {
    const startDate = instadate.noon(this.parent.dateField.startDate.getDate());
    const endDate = instadate.noon(this.parent.dateField.endDate.getDate());
    let startTime = this.startTime.time;
    let endTime = this.endTime.time;

    // keep timeField synced if daily estimate is set
    if (e.name === 'search_start_time' && this.task.estimated_minutes) {
      endTime = moment
        .utc(startTime, 'HH:mm')
        .add(this.task.estimated_minutes, 'minutes')
        .format('HH:mm');
      this.endTime.time = endTime;
    }

    if (e.name === 'search_end_time' && this.task.estimated_minutes) {
      startTime = moment
        .utc(endTime, 'HH:mm')
        .subtract(this.task.estimated_minutes, 'minutes')
        .format('HH:mm');
      this.startTime.time = startTime;
    }

    // Start date cant be after end date only for a 1 day long task
    if (instadate.isSameDay(startDate, endDate)) {
      if (startTime !== this.task.start_time) {
        if ((startTime && !endTime) || startTime > endTime) {
          endTime = moment
            .utc(startTime, 'HH:mm')
            .add(1, 'hour')
            .format('HH:mm');
          this.endTime.time = endTime;
        }
      }

      if (endTime !== this.task.end_time) {
        if ((endTime && !startTime) || startTime > endTime) {
          startTime = moment
            .utc(endTime, 'HH:mm')
            .subtract(1, 'hour')
            .format('HH:mm');
          this.startTime.time = startTime;
        }
      }
    }

    this.parent.task.set({ start_time: startTime, end_time: endTime });
  },

  // updateElValues() {
  //   this.startTime.time = this.task.start_time;
  //   this.endTime.time = this.task.end_time;
  // },

  onFocusOnStartTime(event) {
    if (event.target === this.queryByHook('input-start-time')) {
      this.startTime.onInputClick();
    }
  },

  onFocusOnEndTime(event) {
    if (event.target === this.queryByHook('input-end-time')) {
      this.endTime.onInputClick();
    }
  },

  onKeyDownOnStartTime(event) {
    switch (event.keyCode || event.which) {
      case 9:
        this.startTime.closePopup();
        break;
      case 37:
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      case 38:
        event.preventDefault();
        this.startTime.popup.goUp();
        break;
      case 40:
        event.preventDefault();
        this.startTime.popup.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.startTime.popup.useSelected();
        break;
    }
  },

  onKeyDownOnEndTime(event) {
    switch (event.keyCode || event.which) {
      case 9:
        this.endTime.closePopup();
        break;
      case 37:
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      case 38:
        event.preventDefault();
        this.endTime.popup.goUp();
        break;
      case 40:
        event.preventDefault();
        this.endTime.popup.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.endTime.popup.useSelected();
        break;
    }
  },
});
