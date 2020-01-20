import View from 'ampersand-view';
import ViewSwitcher from 'ampersand-view-switcher';
import * as api from '../../api/api';
import TaskView from '../task/task_view';
import AuthView from '../auth/auth_view';
import LoaderView from '../loader/loader_view';
import ErrorView from '../error/error_view';
import * as collections from 'src/models/collections';
import template from './popup_view.dot';

const PopupView = View.extend({
  template,

  props: {
    hub: 'object',
    link: 'string',
    task: 'state',
    loader: 'state',
    error: 'state',
  },

  initialize() {
    this.listenTo(this.hub, 'popup:update', this.updatePopup);
    this.listenTo(this.hub, 'popup:close', this.closePopup);
    this.listenTo(this.hub, 'error:show', this.showError);
    this.listenTo(this.hub, 'error:hide', this.hideError);
    this.listenTo(this.hub, 'task:created', this.saveTaskSource);
  },

  render() {
    this.renderWithTemplate();

    this.loader = new LoaderView({ hub: this.hub });
    this.renderSubview(this.loader);

    this.switcher = new ViewSwitcher(this.queryByHook('popup-content'));
    this.registerSubview(this.switcher);

    this.updateContentView();

    return this;
  },

  updateContentView() {
    const content = api.auth.authenticated
      ? new TaskView({ hub: this.hub, model: this.task })
      : new AuthView({ hub: this.hub });

    this.switcher.set(content);
  },

  updatePopup() {
    this.updateContentView();
    this.resizeWindow();
  },

  closePopup() {
    chrome.windows.getCurrent(function(window) {
      chrome.windows.remove(window.id);
    });
  },

  showError(error) {
    if (error.message === 'refresh_denied') {
      this.updateContentView();
    } else {
      this.error = new ErrorView({ hub: this.hub, error });
      this.renderSubview(this.error);
      this.resizeWindow(280 < window.innerHeight ? 0 : 100);
    }
  },

  hideError() {
    this.error.remove();
    this.resizeWindow();
  },

  saveTaskSource(task, account) {
    if (!this.link) {
      return;
    }

    collections.taskSources.create({
      task_id: task.id,
      account_id: account.id,
      source_link: this.link,
    });
  },

  resizeWindow(dy = document.body.offsetHeight - window.innerHeight + 5) {
    window.resizeBy(0, dy);
  },
});

export default PopupView;
