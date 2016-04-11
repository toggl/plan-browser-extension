var View = require('ampersand-view');
var ShadowView = require('../shadow/shadow_view');
var style = require('../../../../app/styles/button.css');

var ContentView = View.extend({

  template: require('./button_view.hbs'),

  props: {
    hub: 'state'
  },

  events: {
    'click': 'onClick'
  },

  render: function() {
    this.renderWithTemplate();
    return this;
  },

  onClick: function(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  }

});

var ButtonView = View.extend({
  props: {
    hub: 'state',
    view: 'state'
  },

  render: function() {
    var content = new ContentView(this.attributes);

    this.view = new ShadowView({
      name: 'tw-button',
      style: style,
      content: content
    });

    this.registerSubview(this.view);
    this.view.render();

    this.el = this.view.el;
    return this.view;
  }
});

module.exports = ButtonView;
