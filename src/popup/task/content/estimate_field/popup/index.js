import AmpersandView from 'ampersand-view';
import Checkbox from 'components/checkbox';
import Radio from 'components/radio';
import instadate from 'instadate';
import moment from 'moment';
import { recomputeTimes } from 'src/popup/task/helpers';
import { clamp } from 'src/utils/clamp';
import {
  DAYS_IN_A_YEAR,
  HOURS_IN_A_DAY,
  MINUTES_IN_AN_HOUR,
} from 'src/utils/datetime';
import css from './style.module.scss';
import template from './template.dot';

export default AmpersandView.extend({
  template,
  css,

  props: {
    task: ['state', true],
    me: ['object', true],
  },

  session: {
    hours: 'number',
    minutes: 'number',
    type: 'string',
    skipWeekends: 'boolean',
  },

  derived: {
    isSameDay: {
      deps: [
        'task.start_date',
        'task.end_date',
        'task.computedStartDate',
        'task.computedEndDate',
      ],
      fn() {
        const {
          start_date,
          end_date,
          computedStartDate,
          computedEndDate,
        } = this.task;

        if (!start_date || !end_date) {
          return false;
        }

        return instadate.isSameDay(computedStartDate, computedEndDate);
      },
    },
    maximumHours: {
      deps: ['type'],
      fn() {
        return this.type === 'daily' ? 23 : HOURS_IN_A_DAY * DAYS_IN_A_YEAR;
      },
    },
    weekendDays: {
      deps: ['me.preferences.weekend_days'],
      fn() {
        return this.me.preferences.weekend_days;
      },
    },
    disableSkipWeekendsCheckbox: {
      deps: ['task.start_date', 'task.end_date', 'weekendDays'],
      fn() {
        return this.task.isWeekendDaysOnly(this.weekendDays);
      },
    },
  },

  events: {
    'mousedown [data-hook="estimate-popup:increment"]': 'handleIncrement',
    'mousedown [data-hook="estimate-popup:decrement"]': 'handleDecrement',
    'input [data-hook="estimate-popup:hours"]': 'handleInputHours',
    'input [data-hook="estimate-popup:minutes"]': 'handleInputMinutes',
    'blur input': 'handleInputBlur',
    'keydown input': 'handleInputKeydown',
  },

  bindings: {
    hours: {
      type(el, value) {
        el.value = value || null;
      },
      hook: 'estimate-popup:hours',
    },
    minutes: {
      type(el, value) {
        el.value = value || null;
      },
      hook: 'estimate-popup:minutes',
    },
    type: {
      type(el, value) {
        el.removeAttribute('maxlength');

        if (value === 'daily') {
          el.setAttribute('maxlength', '2');
        }
      },
      hook: 'estimate-popup:hours',
    },
    maximumHours: {
      type: 'attribute',
      name: 'max',
      hook: 'estimate-popup:hours',
    },
  },

  subviews: {
    dailyTypeRadioView: {
      hook: 'estimate-popup:type:daily',
      prepareView() {
        const view = new Radio({
          name: 'estimate-type',
          value: 'daily',
          label: 'Daily',
          checked: this.type === 'daily',
          onClick: value => this.handleClickType(value),
        });
        return view;
      },
    },
    totalTypeRadioView: {
      hook: 'estimate-popup:type:total',
      prepareView() {
        const view = new Radio({
          name: 'estimate-type',
          value: 'total',
          label: 'Total',
          checked: this.type === 'total',
          onClick: value => this.handleClickType(value),
        });
        return view;
      },
    },
    skipWeekendsCheckboxView: {
      hook: 'estimate-popup:skip-weekends',
      prepareView() {
        const view = new Checkbox({
          size: 16,
          label: 'Skip weekends',
          value:
            !this.disableSkipWeekendsCheckbox &&
            this.task.estimate_skips_weekend,
          labelClassname: css.checkbox,
          uncheckOnDisabled: true,
          disabled: this.disableSkipWeekendsCheckbox,
          onChange: value => this.handleToggleSkipWeekends(value),
        });
        return view;
      },
    },
  },

  initialize() {
    this.addEventListeners();
    this.guesstimateValues();
  },

  addEventListeners() {
    this.listenTo(this, 'change:type', () => {
      this.dailyTypeRadioView?.updateChecked(this.type === 'daily');
      this.totalTypeRadioView?.updateChecked(this.type === 'total');
    });

    this.listenTo(this, 'change:disableSkipWeekendsCheckbox', () => {
      this.skipWeekendsCheckboxView?.updateProps({
        disabled: this.disableSkipWeekendsCheckbox,
      });
    });

    this.listenToAndRun(
      this.task,
      'change:estimated_minutes change:estimate_type change:estimate_skips_weekend',
      () => this.resetValues()
    );

    this.listenToAndRun(
      this,
      'change:task.start_date change:task.end_date',
      () => {
        this.skipWeekends = !this.skipWeekends
          ? this.skipWeekends
          : !this.task.isWeekendDaysOnly(this.weekendDays);
      }
    );
  },

  handleIncrement(e) {
    e.preventDefault();
    this.hours = clamp(this.hours + 1, 0, this.maximumHours);
  },

  handleDecrement(e) {
    e.preventDefault();
    this.hours = clamp(this.hours - 1, 0, this.maximumHours);
  },

  handleInputHours(e) {
    const value = e.target?.value ?? '0';
    const parsedValue = parseInt(value);
    this.hours =
      isNaN(parsedValue) || parsedValue < 0
        ? 0
        : parsedValue > this.maximumHours
        ? this.maximumHours
        : parsedValue;
  },

  handleInputMinutes(e) {
    const value = e.target?.value ?? '0';
    const parsedValue = parseInt(value);
    this.minutes =
      isNaN(parsedValue) || parsedValue < 0
        ? 0
        : parsedValue > 59
        ? 59
        : parsedValue;
  },

  handleInputBlur() {
    const estimated_minutes = this.hours * MINUTES_IN_AN_HOUR + this.minutes;

    if (this.saveOnFieldTouched && estimated_minutes) {
      this.save(estimated_minutes);
    }
  },

  handleInputKeydown(e) {
    const key = e.key;
    const length = e.target?.value?.length;

    if (key === 'Enter') {
      this.trigger('close');
    }

    if (
      key === '-' ||
      /^[a-zA-Z]?$/.test(key) ||
      (/[0-9]/.test(key) && this.type === 'daily' && length === 2)
    ) {
      e.preventDefault();
    }
  },

  handleClickType(value) {
    this.type = value;
    if (this.hours > this.maximumHours) {
      this.hours = this.maximumHours;
    }
  },

  handleToggleSkipWeekends(value) {
    this.skipWeekends = value;
  },

  guesstimateValues() {
    const { start_time, end_time, estimated_minutes } = this.task;

    if (estimated_minutes || !start_time || !end_time) {
      return;
    }

    const estimate = moment(end_time, 'HH:mm').diff(
      moment(start_time, 'HH:mm'),
      'minutes'
    );
    const hours = Math.floor(estimate / MINUTES_IN_AN_HOUR);
    const minutes = estimate % MINUTES_IN_AN_HOUR;

    this.set({
      hours,
      minutes,
      type: 'daily',
    });
  },

  resetValues() {
    const skipWeekends = this.task.estimate_skips_weekend;
    const type = this.task.estimate_type ?? 'daily';
    const estimate = this.task.estimated_minutes ?? 0;
    const hours = Math.floor(estimate / MINUTES_IN_AN_HOUR);
    const minutes = estimate % MINUTES_IN_AN_HOUR;

    if (
      hours === this.hours &&
      minutes === this.minutes &&
      type === this.type &&
      skipWeekends === this.skipWeekends
    ) {
      return;
    }

    this.set({
      hours,
      minutes,
      type,
      skipWeekends,
    });
  },

  save(estimated_minutes) {
    const attributes = {
      estimated_minutes,
      estimate_type: this.type,
      estimate_skips_weekend: this.skipWeekends,
    };
    const dailyEstimate =
      this.type === 'daily'
        ? estimated_minutes
        : estimated_minutes /
          this.task.lengthInDays(this.skipWeekends, this.weekendDays);
    const recomputedTimes = recomputeTimes(
      this.task,
      null,
      null,
      null,
      null,
      dailyEstimate
    );

    if (recomputedTimes) {
      attributes.start_time = recomputedTimes.startTime;
      attributes.end_time = recomputedTimes.endTime;
    }

    this.task.set(attributes);
  },

  remove() {
    const estimated_minutes = this.hours * MINUTES_IN_AN_HOUR + this.minutes;
    this.save(estimated_minutes);
    AmpersandView.prototype.remove.call(this);
  },

  close() {
    this.trigger('close');
  },
});
