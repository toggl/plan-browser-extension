const View = require('ampersand-view');

const LoaderView = View.extend({
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

  initialize() {
    this.listenTo(this.hub, 'loader:show', this.show);
    this.listenTo(this.hub, 'loader:hide', this.hide);
  },

  render() {
    this.renderWithTemplate();
    return this;
  },

  show() {
    this.visible = true;
  },

  hide() {
    this.visible = false;
  }
});

module.exports = LoaderView;
