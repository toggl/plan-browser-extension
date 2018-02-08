const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const SelectField = require('../fields/searchable_select_field/field');

module.exports = View.extend({
  template: '<div></div>',

  props: {
    value: 'number',
    users: 'object',
    selectOpts: 'object',
  },

  derived: {
    isFilled: {
      deps: ['hasUser'],
      fn() {
        return this.hasUser;
      }
    },
    hasUser: {
      deps: ['value'],
      fn() {
        return !!this.value;
      }
    }
  },

  onChange(el, val) {
    this.value = this.users.models.find(item => item.name === val).id;
  },

  createInput() {
    return new SelectField(Object.assign({}, this.selectOpts, {
      items: this.users.models,
      label: 'User',
      getItemTemplate: this.getItemTemplate
    }));
  },

  switchAccount(account) {
    this.users = new FilteredCollection(account.users, {
      where: { active: true },
      comparator: 'name'
    });
    this.value = null;
    this.render();

    this.select = this.createInput();
    this.listenTo(this.select, 'change:value', this.onChange);
    this.renderSubview(this.select);
  },

  getItemTemplate({original, string}) {
    const idx = Math.floor(Math.random() * 40) + 1 ;
    const avatar = -1 !== original.picture_url.search('missing.png')
      ? `<div class="searchable-select-dropdown__color-circle circle-color--${idx}"></div>`
      : `<img class="searchable-select-dropdown__color-circle" src="${original.picture_url}" />`;

    const tmpl = `
      <div class="row row--align-center pointer hover" data-value="${original.name}" data-hook="select" data-select-row data-visible>
        ${avatar}
        <div class="searchable-select-dropdown__select">${string}</div>
      </div>
    `;
    return {tmpl};
  }
});
