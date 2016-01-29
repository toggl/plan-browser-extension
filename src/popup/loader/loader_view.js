var View = require('ampersand-view');

var LoaderView = View.extend({

  template: require('./loader_view.hbs'),

  props: {
    hub: 'object',
    visible: 'boolean'
  },

  bindings: {
    visible: {
      type: 'booleanClass',
      yes: 'loader--visible',
      no: 'loader--hidden'
    }
  },

  initialize: function() {
    this.listenTo(this.hub, 'loader:show', this.show);
    this.listenTo(this.hub, 'loader:hide', this.hide);
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  show: function() {
    this.visible = true;
  },

  hide: function() {
    this.visible = false;
  }

});

module.exports = LoaderView;
