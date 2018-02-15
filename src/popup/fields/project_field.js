const View = require('ampersand-view');
const SelectField = require('../fields/searchable_select_field/field');

module.exports = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    selectOpts: 'object',
    disabled: 'boolean',
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

  onChangeDisableState() {
    this.select.isEditable = !this.disabled;
  },

  onCollection() {
    this.render();
  },

  render() {
    this.select = this.createInput();
    this.listenTo(this.select, 'change:value', this.onChange);
    this.listenTo(this, 'change:disabled', this.onChangeDisableState);

    this.renderWithTemplate(this);
    this.renderSubview(this.select);
  },

  onChange(el, val) {
    this.value = this.collection.find(item => item.name === val).id;
  },

  createInput() {
    return new SelectField(Object.assign({}, this.selectOpts, {
      items: this.collection ? this.collection.models : [],
      label: 'Project',
      getItemTemplate: this.getItemTemplate
    }));
  },

  getItemTemplate({original, string}) {
    const tmpl = `
      <div class="searchable-select-dropdown__item row row--align-center pointer hover" data-value="${original.name}" data-hook="select" data-select-row data-visible>
        <div class="searchable-select-dropdown__color-circle circle-color--${original.color}"></div>
        <div class="searchable-select-dropdown__select">${string}</div>
      </div>
    `;
    return {tmpl};
  }
});
