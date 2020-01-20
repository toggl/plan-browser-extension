import View from 'ampersand-view';
import StyleView from '../style/style_view';
import template from './shadow_view.dot';

const ShadowView = View.extend({
  template,

  props: {
    name: 'string',
    style: 'string',
    content: 'state',
  },

  events: {
    click: 'stopPropagation',
    keyup: 'stopPropagation',
    keydown: 'stopPropagation',
    keypress: 'stopPropagation',
  },

  render() {
    this.renderWithTemplate();

    this.shadow = createShadowRoot(this.el);

    if (this.style) {
      const style = new StyleView({ style: this.style });
      this.renderSubview(style, this.shadow);
    }

    if (this.content) {
      this.renderSubview(this.content, this.shadow);
    }

    return this;
  },

  stopPropagation(event) {
    event.stopPropagation();
  },
});

export default ShadowView;

function createShadowRoot(el) {
  if (el.attachShadow) {
    return el.attachShadow({ mode: 'open' });
  }
  if (el.createShadowRoot) {
    return el.createShadowRoot();
  }
  return el; // todo(mitchel): use https://github.com/webcomponents/shadydom
}
