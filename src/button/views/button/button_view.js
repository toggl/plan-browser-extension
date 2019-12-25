import View from 'ampersand-view';
import ShadowView from '../shadow/shadow_view';
import style from '../../styles/button.less';
import template from './button_view.hbs';

const ContentView = View.extend({
  template,

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

export default ButtonView;
