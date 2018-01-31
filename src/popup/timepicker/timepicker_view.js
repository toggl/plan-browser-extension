const moment = require('moment');
const View = require('ampersand-view');

const TimepickerView = View.extend({
  template: require('./timepicker_view.hbs'),

  events: {
    'click [data-time]': 'onSelect',
    'mousedown': 'onMousedown'
  },

  render() {
    const times = this.createTimes().map(function(time) {
      return {
        time: time.format('HH:mm'),
        text: time.format('LT')
      };
    });

    this.renderWithTemplate({times});
    return this;
  },

  scroll() {
    const item = this.query('[data-time="07:00"]');
    this.el.scrollTop = item.offsetTop;
  },

  createTimes() {
    const times = [];
    const start = moment().set({ hours: 0, minutes: 0 });
    const end = start.clone().add(1, 'days');

    while (start.isBefore(end, 'minute')) {
      times.push(start.clone());
      start.add(30, 'minutes');
    }

    return times;
  },

  onSelect(event) {
    event.preventDefault();
    const time = event.target.getAttribute('data-time');
    this.trigger('select', time);
  },

  onMousedown(event) {
    event.preventDefault();
  }
});

module.exports = TimepickerView;
