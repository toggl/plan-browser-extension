import _ from 'lodash';
import hub from 'src/popup/utils/hub';
import View from 'ampersand-view';
import moment from 'moment';
import { defer, isEmpty } from 'lodash';
import DynamicInput from 'src/popup/fields/dynamic_input';
import popupTemplate from './timepicker_popup.dot';

const TimePicker = View.extend({
  props: {
    time: 'string',
    name: 'string',
    disabled: 'boolean',
    placeholder: 'string',
    input: 'state',
    me: ['object', true],
  },

  derived: {
    value: {
      deps: ['time'],
      fn() {
        if (!isEmpty(this.time)) {
          return moment.utc(this.time, 'HH:mm').format('H:mm');
        } else {
          return null;
        }
      },
    },
  },

  events: {
    'keydown input': 'onKeyDown',
  },

  initialize() {
    this.input = new DynamicInput({
      el: this.el,
      name: this.name,
      placeholder: this.placeholder,
      disabled: this.disabled,
      showArrow: !this.disabled,
    });

    this.registerSubview(this.input);

    this.listenToAndRun(this, 'change:value', this.updateInputValue);
    this.listenTo(this.input, 'click', this.onInputClick);
    this.listenTo(this.input, 'update', this.onInputUpdate);
  },

  render() {
    this.input.render();
    this.el = this.input.el;
  },

  updateInputValue() {
    this.input.value = this.value;
  },

  onInputClick() {
    if (
      // this.popup ||
      this.disabled
    ) {
      return;
    }

    this.popup = new TimepickerPopup({ time: this.time, me: this.me });

    hub.trigger('popups:show', {
      name: 'time-picker-popup',
      content: this.popup,
      direction: 'up',
      positioning: {
        position: 'down',
        anchor: $(this.el),
        distance: 10,
      },
      overlay: {
        closeOnClick: true,
      },
      modifiers: ['rounded'],
    });

    this.listenToOnce(this.popup, 'select', function(time) {
      this.time = time;
      this.closePopup();
    });
  },

  onInputUpdate(value) {
    if (isEmpty(value)) {
      this.time = null;
    } else {
      const date = moment.utc(value, 'HH:mm');

      if (date.isValid()) {
        this.time = date.format('HH:mm');
      }
    }

    this.closePopup();
  },

  onKeyDown(event) {
    switch (event.keyCode || event.which) {
      case 9:
        this.closePopup();
        break;
      case 38:
        event.preventDefault();
        this.popup.goUp();
        break;
      case 40:
        event.preventDefault();
        this.popup.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.popup.useSelected();
        break;
    }
  },

  getTime() {
    return this.time;
  },

  closePopup() {
    if (this.popup) {
      this.popup.close();
      this.popup = null;
    }
  },
});

const TimepickerPopup = View.extend({
  template: popupTemplate,

  props: {
    selectedTimeIndex: 'number',
    me: ['object', true],
  },

  initialize() {
    this.listenTo(this, 'change:selectedTimeIndex', this.highlightSelectedRow);
  },

  events: {
    'mousedown [data-hook=time]': 'onSelect',
  },

  render() {
    this.renderWithTemplate({ items: this.getTimes() });

    defer(() => {
      this.el.scrollTop = this.query('[data-time="07:00"]').offsetTop;
    });
  },

  highlightSelectedRow() {
    let element;
    const iterable = this.getSelectableRows();
    for (let index = 0; index < iterable.length; index++) {
      const row = iterable[index];
      if (index === this.selectedTimeIndex) {
        element = row;
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    }

    if (element) {
      this.scrollToRow(element);
    }
  },

  scrollToRow(element) {
    const { scrollTop, scrollHeight, clientHeight } = this.el;
    const scrollBottom = scrollHeight - clientHeight - scrollTop;

    const elementTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    const elementBottom = scrollHeight - elementHeight - elementTop;

    if (elementTop < scrollTop) {
      this.el.scrollTop = elementTop;
    } else if (elementBottom < scrollBottom) {
      this.el.scrollTop += scrollBottom - elementBottom;
    }
  },

  getSelectableRows() {
    return this.queryAll('[data-hook=time]');
  },

  getNumberOfRows() {
    return this.getTimes().length;
  },

  getTimes() {
    const times = [];

    for (let hours = 0; hours <= 23; hours++) {
      [0, 30].forEach(minutes => {
        const date = moment.utc({ hours, minutes });

        times.push({
          time: date.format('HH:mm'),
          text: date.format(this.getLocalTimeFormat()),
        });
      });
    }

    return times;
  },

  goUp() {
    if (!_.isNil(this.selectedTimeIndex)) {
      if (this.selectedTimeIndex > 0) {
        return this.selectedTimeIndex--;
      }
    } else {
      return (this.selectedTimeIndex = this.getNumberOfRows() - 1);
    }
  },

  goDown() {
    if (!_.isNil(this.selectedTimeIndex)) {
      if (this.selectedTimeIndex < this.getNumberOfRows() - 1) {
        this.selectedTimeIndex++;
      }
    } else {
      this.selectedTimeIndex = 0;
    }
  },

  useSelected() {
    if (!_.isNil(this.selectedTimeIndex)) {
      const rows = this.getSelectableRows();
      const {
        dataset: { time },
      } = rows[this.selectedTimeIndex];
      this.trigger('select', time);
      this.close();
    }
  },

  onSelect(event) {
    const target = $(event.target).closest('[data-time]');
    this.trigger('select', target.attr('data-time'));
  },

  close() {
    this.trigger('close');
  },

  getLocalTimeFormat() {
    this.me.preferences.militaryTime ? 'H:mm' : 'h:mm A';
  },
});

export default TimePicker;
