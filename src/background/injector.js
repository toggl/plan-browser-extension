import CustomDomainCollection from 'src/models/custom_domain_collection';
import assets from './injected_assets.json';
import { executeScript, insertCSS } from './util';

const injector = {
  initialize() {
    this.listeners = {};

    this.collection = new CustomDomainCollection();

    this.collection.on('add', model => this.addNavigationListener(model));
    this.collection.on('remove', model => this.removeNavigationListener(model));

    this.collection.enableAutoSync();
    this.collection.fetch();
  },

  addNavigationListener(model) {
    const listener = details => {
      this.injectTab(details.tabId, model.service);
    };

    this.listeners[model.id] = listener;

    chrome.webNavigation.onCompleted.addListener(listener, {
      url: [{ hostSuffix: model.domain }],
    });
  },

  removeNavigationListener(model) {
    const listener = this.listeners[model.id];
    chrome.webNavigation.onCompleted.removeListener(listener);
    delete this.listeners[model.id];
  },

  injectTab(tab, service) {
    assets[service].scripts.forEach(file => {
      executeScript(tab, file);
    });

    assets[service].styles.forEach(file => {
      insertCSS(tab, file);
    });
  },
};

injector.initialize();
