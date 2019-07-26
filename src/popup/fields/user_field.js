const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const SelectField = require('../fields/searchable_select_field/field');

module.exports = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    users: 'object',
    selectOpts: 'object',
    disabled: 'boolean',
  },

  derived: {
    isFilled: {
      deps: ['hasUser'],
      fn() {
        return this.hasUser;
      },
    },
    hasUser: {
      deps: ['value'],
      fn() {
        return !!this.value;
      },
    },
  },

  onChange(el, val) {
    this.value = this.users.models.find(item => item.name === val).id;
  },

  onChangeDisableState() {
    this.select.isEditable = !this.disabled;
  },

  createInput() {
    return new SelectField(
      Object.assign({}, this.selectOpts, {
        items: this.users ? this.users.models : [],
        label: 'User',
        getItemTemplate: this.getItemTemplate,
      })
    );
  },

  render() {
    this.select = this.createInput();
    this.listenTo(this.select, 'change:value', this.onChange);
    this.listenTo(this, 'change:disabled', this.onChangeDisableState);

    this.renderWithTemplate(this);
    this.renderSubview(this.select);
  },

  switchAccount(account) {
    this.users = new FilteredCollection(account.users, {
      where: { active: true },
      comparator: 'name',
    });
    this.value = null;

    this.render();
  },

  getItemTemplate({ original, string }) {
    const idx = Math.floor(Math.random() * 40) + 1;
    const avatar =
      -1 !== original.picture_url.search('missing.png')
        ? `<div class="searchable-select-dropdown__color-circle circle-color--${idx}"></div>`
        : `<img class="searchable-select-dropdown__color-circle" src="${
            original.picture_url
          }" />`;

    const tmpl = `
      <div class="searchable-select-dropdown__item row row--align-center pointer hover" data-value="${
        original.name
      }" data-hook="select" data-select-row data-visible>
        ${avatar}
        <div class="searchable-select-dropdown__select">${string}</div>
      </div>
    `;
    return { tmpl };
  },
});
