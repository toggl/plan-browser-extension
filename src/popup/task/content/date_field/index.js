import View from 'ampersand-view';
import Datepicker from 'src/popup/fields/datepicker/datepicker';
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
    startDate: {
      hook: 'input-start-date',
      prepareView() {
        const { disabled, task, me } = this;
        return new Datepicker({
          name: 'search_start_date',
          date: task.start_date ? task.computedStartDate : null,
          disabled,
          placeholder: 'Select Start Date',
          me,
        });
      },
    },
    endDate: {
      hook: 'input-end-date',
      prepareView() {
        const { disabled, task, me } = this;
        return new Datepicker({
          name: 'search_end_date',
          date: task.end_date ? task.computedEndDate : null,
          disabled,
          placeholder: 'Select End Date',
          me,
        });
      },
    },
  },

  events: {
    'focus [data-hook=input-start-date]': 'onFocusOnStartDate',
    'focus [data-hook=input-end-date]': 'onFocusOnEndDate',
    'keydown [data-hook=input-start-date]': 'onKeyDownOnStartDate',
    'keydown [data-hook=input-end-date]': 'onKeyDownOnEndDate',
  },

  render() {
    this.renderWithTemplate();
    this.listenTo(this.startDate, 'change:date', this.updateStartDate);
    this.listenTo(this.endDate, 'change:date', this.updateEndDate);
  },

  updateStartDate() {
    const start = instadate.noon(this.startDate.getDate());
    let end = instadate.noon(this.endDate.getDate());
    if (instadate.differenceInDates(start, end) < 0) {
      end = start;
      this.endDate.date = start;
    }
    this.updateDates(dateToString(start), dateToString(end));
  },

  updateEndDate() {
    let start = instadate.noon(this.startDate.getDate());
    const end = instadate.noon(this.endDate.getDate());
    if (instadate.differenceInDates(start, end) < 0) {
      start = end;
      this.startDate.date = end;
    }
    this.updateDates(dateToString(start), dateToString(end));
  },

  updateDates(startDate, endDate) {
    if (startDate !== this.task.start_date || endDate !== this.task.end_date) {
      this.parent.task.set({
        start_date: startDate,
        end_date: endDate,
      });
    }
  },

  // updateElValues() {
  //   this.startDate.date = this.task.start_date
  //     ? this.task.computedStartDate
  //     : null;
  //
  //   this.endDate.date = this.task.end_date ? this.task.computedEndDate : null;
  // },

  onFocusOnStartDate(event) {
    if (event.target === this.queryByHook('input-start-date')) {
      this.startDate.onInputClick();
    }
  },

  onFocusOnEndDate(event) {
    if (event.target === this.queryByHook('input-end-date')) {
      this.endDate.onInputClick();
    }
  },

  onKeyDownOnStartDate(event) {
    switch (event.keyCode || event.which) {
      case 9:
        this.startDate.closePopup();
        break;
      case 37:
      case 39:
        if (event.target === this.queryByHook('input-start-date')) {
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 38:
      case 40:
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  },

  onKeyDownOnEndDate(event) {
    switch (event.keyCode || event.which) {
      case 9:
        this.endDate.closePopup();
        break;
      case 37:
      case 39:
        if (event.target === this.queryByHook('input-end-date')) {
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 38:
      case 40:
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  },
});

function dateToString(date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  }
}
