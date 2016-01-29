var View = require('ampersand-view');

var ProjectField = View.extend({

  template: require('./project_field_default.hbs'),

  props: {
    value: 'number',
    isActive: 'boolean'
  },

  derived: {
    isFilled: {
      deps: ['value'],
      fn: function() {
        return this.value != null;
      }
    }
  },

  events: {
    'change': 'onChange'
  },

  bindings: {
    value: { type: 'value' }
  },

  initialize: function() {
    this.listenTo(this, 'change:collection', this.onCollection);
  },

  onChange: function(event) {
    if (this.el.value.length > 0) {
      this.value = Number(this.el.value);
    } else {
      this.value = null;
    }
  },

  onCollection: function() {
    this.isActive = this.collection != null;
    this.render();
  },

  render: function() {
    this.el.innerHTML = this.template(this);

    if (this.isActive) {
      this.renderCollection(this.collection, ProjectOption, this.el);
    }
    
    return this;
  }

});

var ProjectOption = View.extend({

  template: require('./project_field_option.hbs')

});

module.exports = ProjectField;
