const View = require('ampersand-view');
const Pikaday = require('pikaday');

const DatepickerView = View.extend({
  template: require('./datepicker_view.hbs'),

  props: {
    date: 'date',
    pikaday: 'object'
  },

  events: {
    'mousedown': 'onMousedown'
  },

  render() {
    this.renderWithTemplate();

    this.pikaday = new Pikaday({
      onSelect: this.onSelect.bind(this),
      defaultDate: this.date,
      setDefaultDate: true
    });

    const contentEl = this.queryByHook('datepicker-content');
    contentEl.appendChild(this.pikaday.el);

    return this;
  },

  onMousedown(event) {
    event.preventDefault();
  },

  onSelect() {
    this.trigger('select', this.pikaday.getDate());
  },

  remove() {
    View.prototype.remove.call(this);
    this.pikaday.destroy();
  }
});

module.exports = DatepickerView;
