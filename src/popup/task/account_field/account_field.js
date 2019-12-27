import View from 'ampersand-view';
import FilteredCollection from 'ampersand-filtered-subcollection';
import { saveSelectedAccount } from 'src/utils/me';
import * as api from 'src/api/api';
import accounts from 'src/models/account_collection';
import WorkspaceItem from './workspace_item/workspace_item';
import template from './account_field.dot';
import css from './account_field.module.scss';
import './account_field.scss';

const AccountField = View.extend({
  template,
  css,

  props: {
    selectedAccountId: 'number',
    sortedAccounts: 'object',
    showing: ['boolean', false, false],
  },

  bindings: {
    showing: {
      type: 'booleanClass',
      hook: 'popup',
      name: 'account-field-popup--active',
    },
  },

  events: {
    click: 'onClick',
    'click [data-hook=signout]': 'onSignout',
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
    this.selectedAccountId = parseInt(
      event.delegateTarget.dataset.workspace,
      10
    );
    saveSelectedAccount(this.selectedAccountId);
    this.onHide();
  },

  switchAccount(account) {
    this.selectedAccountId = account.id;
  },

  onSignout() {
    api.auth.revoke().then(() => {
      this.onHide();
      window.location.reload();
    });
  },

  initialize() {
    this.sortedAccounts = new FilteredCollection(accounts, {
      comparator: 'name',
    });

    window.onclick = () => this.onHide();
  },

  render() {
    this.renderWithTemplate(this);

    this.renderCollection(
      this.sortedAccounts,
      WorkspaceItem,
      this.queryByHook('workspaces')
    );

    const menu = this.queryByHook('menu');
    const popup = this.queryByHook('popup');
    popup.style.top = `${menu.offsetTop + 50}px`;
    popup.style.right = '33px';
  },
});

export default AccountField;
