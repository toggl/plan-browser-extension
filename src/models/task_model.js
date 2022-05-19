import moment from 'moment';
import Model from 'ampersand-model';
import sync from '../api/api_sync';
import instadate from 'instadate';
import _isNaN from 'lodash/isNaN';
import _isNumber from 'lodash/isNumber';

const TaskModel = Model.extend({
  sync,

  props: {
    id: 'number',
    name: 'string',
    user_id: 'number',
    plan_id: 'number',
    timeline_segment_id: 'number',
    plan_status_id: 'number',
    start_date: 'date',
    end_date: 'date',
    start_time: 'string',
    end_time: 'string',
    estimated_minutes: 'number',
    estimate_type: ['string', false, 'daily'],
    estimate_skips_weekend: ['boolean', false, false],
    notes: 'string',
    color_id: 'number',
    done: 'boolean',
    workspace_members: ['array', true, () => []],
  },

  derived: {
    computedStartDate: {
      deps: ['start_date'],
      fn() {
        const date = new Date(this.start_date ?? new Date());
        return instadate.noon(date);
      },
    },
    computedEndDate: {
      deps: ['end_date'],
      fn() {
        const date = new Date(this.end_date ?? new Date());
        return instadate.noon(date);
      },
    },
  },

  parse(attrs) {
    return {
      ...attrs,
      start_date: attrs.start_date
        ? moment(attrs.start_date, 'YYYY-MM-DD').toDate()
        : undefined,
      end_date: attrs.end_date
        ? moment(attrs.end_date, 'YYYY-MM-DD').toDate()
        : undefined,
    };
  },

  serialize() {
    const res = Model.prototype.serialize.call(this);
    if (res.start_date) {
      res.start_date = moment(res.start_date).format('YYYY-MM-DD');
    }
    if (res.end_date) {
      res.end_date = moment(res.end_date).format('YYYY-MM-DD');
    }
    return res;
  },

  assigned(user) {
    return -1 !== this.workspace_members.indexOf(user.membership_id);
  },

  dates() {
    return instadate.dates(this.computedStartDate, this.computedEndDate);
  },

  estimatedMinutes() {
    const float = parseFloat(this.estimated_minutes || 0);
    if (_isNumber(float) && !_isNaN(float)) {
      return float;
    } else {
      return 0;
    }
  },

  lengthInDays(
    skipWeekends = this.estimate_skips_weekend ?? false,
    weekendDays
  ) {
    if (!skipWeekends) {
      return (
        instadate.differenceInDays(
          this.computedStartDate,
          this.computedEndDate
        ) + 1
      );
    }

    const dates = this.dates();

    return dates.filter(o => !weekendDays.includes(o.getDay())).length;
  },

  isWeekendDaysOnly(weekendDays) {
    const dates = this.dates();
    return !dates.some(o => !weekendDays.includes(o.getDay()));
  },
});

export default TaskModel;
