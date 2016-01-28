var moment = require('moment');
var View = require('ampersand-view');
var Pikaday = require('pikaday');

var DatepickerView = View.extend({

  template: require('./datepicker_view.hbs'),

  props: {
    date: 'date',
    pikaday: 'object'
  },

  events: {
    'mousedown': 'onMousedown'
  },

  render: function() {
    this.renderWithTemplate();

    this.pikaday = new Pikaday({
      onSelect: this.onSelect.bind(this),
      defaultDate: this.date,
      setDefaultDate: true
    });

    var contentEl = this.queryByHook('datepicker-content')
    contentEl.appendChild(this.pikaday.el);

    return this;
  },

  onMousedown: function(event) {
    event.preventDefault();
  },

  onSelect: function() {
    this.trigger('select', this.pikaday.getDate());
  },

  remove: function() {
    View.prototype.remove.call(this);
    this.pikaday.destroy();
  }

});

module.exports = DatepickerView;
