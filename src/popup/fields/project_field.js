const View = require('ampersand-view');

const ProjectField = View.extend({
  template: require('./project_field_default.hbs'),

  props: {
    value: 'number',
    isActive: 'boolean'
  },

  derived: {
    isFilled: {
      deps: ['value'],
      fn() {
        return !!this.value;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    value: { type: 'value' }
  },

  initialize() {
    this.listenTo(this, 'change:collection', this.onCollection);
  },

  onChange() {
    if (this.el.value.length > 0) {
      this.value = Number(this.el.value);
    } else {
      this.value = null;
    }
  },

  onCollection() {
    this.isActive = !!this.collection;
    this.render();
  },

  render() {
    this.el.innerHTML = this.template(this);

    if (this.isActive) {
      this.renderCollection(this.collection, ProjectOption, this.el);
    }

    return this;
  }
});

const ProjectOption = View.extend({
  template: require('./project_field_option.hbs')
});

module.exports = ProjectField;
