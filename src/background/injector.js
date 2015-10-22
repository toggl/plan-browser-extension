var CustomDomainCollection = require('../models/custom_domain_collection');
var assets = require('./injected_assets.json');

var injector = {

  initialize: function() {
    this.listeners = {};

    this.collection = new CustomDomainCollection();

    this.collection.on('add', (model) => this.addNavigationListener(model));
    this.collection.on('remove', (model) => this.removeNavigationListener(model));
    
    this.collection.enableAutoSync();
    this.collection.fetch();
  },

  addNavigationListener: function(model) {
    var listener = (details) => {
      this.injectTab(details.tabId, model.service);
    };
    
    this.listeners[model.id] = listener;

    chrome.webNavigation.onCompleted.addListener(listener, {
      url: [{hostSuffix: model.domain}]
    });
  },

  removeNavigationListener: function(model) {
    var listener = this.listeners[model.id];
    chrome.webNavigation.onCompleted.removeListener(listener);
    delete this.listeners[model.id];
  },

  injectTab: function(tab, service) {
    assets[service].scripts.forEach(file => {
      chrome.tabs.executeScript(tab, {file: file});
    });

    assets[service].styles.forEach(file => {
      chrome.tabs.insertCSS(tab, {file: file});
    });
  }

};

injector.initialize();
