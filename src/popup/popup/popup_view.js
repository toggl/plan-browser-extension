const View = require('ampersand-view');
const ViewSwitcher = require('ampersand-view-switcher');
const api = require('../../api/api');
const TaskView = require('../task/task_view');
const AuthView = require('../auth/auth_view');
const LoaderView = require('../loader/loader_view');
const ErrorView = require('../error/error_view');
const collections = require('../../models/collections');

const PopupView = View.extend({
  template: require('./popup_view.hbs'),

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

module.exports = PopupView;
