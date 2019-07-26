const View = require('ampersand-view');
const ShadowView = require('../shadow/shadow_view');
const style = require('../../../../app/styles/button.css');

const ContentView = View.extend({
  template: require('./button_view.hbs'),

  props: {
    hub: 'state',
  },

  events: {
    click: 'onClick',
  },

  render() {
    this.renderWithTemplate();
    return this;
  },

  onClick(event) {
    event.preventDefault();
    this.hub.trigger('button:clicked', event);
  },
});

const ButtonView = View.extend({
  props: {
    hub: 'state',
    view: 'state',
  },

  render() {
    const content = new ContentView(this.attributes);

    this.view = new ShadowView({
      name: 'tw-button',
      style,
      content,
    });

    this.registerSubview(this.view);
    this.view.render();
    this.el = this.view.el;

    return this;
  },
});

module.exports = ButtonView;
