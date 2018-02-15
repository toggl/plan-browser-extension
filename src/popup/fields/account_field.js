const View = require('ampersand-view');
const FilteredCollection = require('ampersand-filtered-subcollection');
const preferences = require('../../utils/preferences');
const api = require('../../api/api');

const AccountField = View.extend({
  template: require('./account_field.hbs'),

  props: {
    value: 'number',
    accounts: 'collection',
    sortedAccounts: 'object',
    showingWorkspaces: ['boolean', true, false],
    showing: ['boolean', false, false],
  },

  bindings: {
    'workspace.name': {
      type: 'text',
      hook: 'workspace'
    },
    showingWorkspaces: {
      type: 'booleanClass',
      hook: 'workspaces',
      name: 'account-field-popup__workspaces--active'
    },
    showing: {
      type: 'booleanClass',
      hook: 'popup',
      name: 'account-field-popup--active'
    },
  },

  derived: {
    workspace: {
      deps: ['value'],
      fn() {
        return this.accounts.get(this.value);
      }
    },
    accountsString: {
      deps: ['value', 'sortedAccounts.models.length'],
      fn() {
        return this.sortedAccounts.map(account => `<div class='account-field-popup__item account-field-popup__workspace' data-workspace='${account.id}'>${account.name}</div>`).join('');
      }
    }
  },

  events: {
    'click': 'onClick',
    'click [data-hook=signout]': 'onSignout',
    'click [data-hook=change-workspace]': 'onChangeWorkspace',
    'click .account-field-popup__workspace': 'onChange',
    'click [data-hook=menu]': 'onShow',
  },

  onShow() {
    this.showing = true;
  },

  onHide() {
    this.showing = false;
  },

  onClick(event) {
    event.stopPropagation();
  },

  onChange(event) {
    this.value = parseInt(event.target.dataset.workspace, 10);
    preferences.set({selected_account_id: this.value});
    this.showingWorkspaces = false;
  },

  switchAccount(account) {
    this.value = account.id;
    this.render();
  },

  onChangeWorkspace() {
    this.showingWorkspaces = !this.showingWorkspaces;
  },

  onSignout() {
    api.auth.revoke().then(() => {
      this.onHide();
      window.location.reload();
    });
  },

  initialize() {
    this.sortedAccounts = new FilteredCollection(this.accounts, {
      comparator: 'name'
    });

    window.onclick = () => this.onHide();
  },

  render() {
    this.renderWithTemplate(this);

    const menu = this.queryByHook('menu');
    const popup = this.queryByHook('popup');
    popup.style.top = `${menu.offsetTop + 30}px`;
    popup.style.right = '6.5px';
  }
});

module.exports = AccountField;
