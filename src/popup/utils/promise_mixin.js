import Promise from 'bluebird';
import hub from 'src/popup/utils/hub';

export const showLoader = function() {
  hub.trigger('loader:show', this.cid);
};

export const hideLoader = function() {
  hub.trigger('loader:hide', this.cid);
};

export const createPromiseChain = function(method) {
  return Promise.resolve()
    .then(() => this.showLoader())
    .then(() => this[method]())
    .finally(() => this.hideLoader());
};
