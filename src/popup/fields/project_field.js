const View = require('ampersand-view');
const SelectField = require('../controls/select');

module.exports = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    selectOpts: 'object',
  },

  derived: {
    isFilled: {
      deps: ['value'],
      fn() {
        return !!this.value;
      }
    }
  },

  bindings: {
    value: { type: 'value' }
  },

  initialize() {
    this.listenTo(this, 'change:collection', this.onCollection);
  },

  onCollection() {
    this.render();
    this.renderSubview(this.createInput()); // todo
  },

  onChange() {
    this.value = parseInt(this.queryByHook('select').value, 10);
  },

  createInput() {
    const options = this
      .collection
      .map(project => `<option value=${project.id}>${project.name}</option>`)
      .join('');

    return new SelectField(Object.assign({}, this.selectOpts, {
      label: 'Project',
      name: 'project',
      placeholder: 'Choose project...',
      options,
      validations: [{
        run: value => !!value,
        message: '*Choose a user',
      }],
    }));
  },
});
