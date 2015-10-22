var CustomDomainCollection = require('../models/custom_domain_collection');

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
    var css = 'styles/' + service + '.css';
    var js = 'scripts/content_' + service + '.js';

    chrome.tabs.insertCSS(tab, {file: 'styles/global.css'});
    chrome.tabs.insertCSS(tab, {file: css});

    chrome.tabs.executeScript(tab, {file: js});
  }

};

injector.initialize();
