var View = require('ampersand-view');

var FormView = View.extend({

  template: require('./form.hbs'),

  events: {
    'click [data-hook=create]': 'onCreate'
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onCreate: function() {
    this.collection.add({
      domain: this.queryByHook('domain').value,
      service: this.queryByHook('service').value
    });

    this.render();
  }

});

module.exports = FormView;
