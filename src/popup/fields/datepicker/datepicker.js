import hub from 'src/popup/utils/hub';
import View from 'ampersand-view';
import moment from 'moment';
import Pikaday from 'pikaday';
import DynamicInput from 'src/popup/fields/dynamic_input';

const Datepicker = View.extend({
  props: {
    date: 'date',
    name: 'string',
    disabled: 'boolean',
    placeholder: 'string',
    input: 'state',
    me: ['object', true],
  },

  derived: {
    value: {
      deps: ['date'],
      fn() {
        return this.date ? moment(this.date).format('MMM D, YYYY') : null;
      },
    },
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

    this.popup = new DatepickerPopup({
      date: moment(this.date).isValid() ? this.date : moment(),
      me: this.me,
    });

    hub.trigger('popups:show', {
      name: 'date-picker-popup',
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

    this.listenToOnce(this.popup, 'select', function(date) {
      this.date = date;
      this.closePopup();
    });
  },

  onInputUpdate(value) {
    const date = moment(value, 'MMM D, YYYY');

    if (date.isValid()) {
      this.date = date.toDate();
    }

    this.closePopup();
  },

  getDate() {
    return this.date;
  },

  closePopup() {
    if (this.popup) {
      this.popup.close();
      this.popup = null;
    }
  },
});

const DatepickerPopup = View.extend({
  props: {
    date: 'date',
    me: ['object', true],
  },

  render() {
    this.picker = new Pikaday({
      onSelect: this.onSelect.bind(this),
      firstDay: this.me.preferences.startOfWeek || 1,
      setDefaultDate: true,
      defaultDate: this.date ? this.date : moment().format('MMM D, YYYY'),
    });

    this.el = this.picker.el;
  },

  onSelect() {
    this.trigger('select', this.picker.getDate());
  },

  close() {
    this.trigger('close');
  },

  remove() {
    View.prototype.remove.call(this);
    this.picker.destroy();
  },
});

export default Datepicker;
