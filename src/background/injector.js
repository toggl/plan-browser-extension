var CustomDomainCollection = require('../models/custom_domain_collection');

var injector = {

  initialize: function() {
    this.collection = new CustomDomainCollection();
    this.collection.fetch().then(() => {
      this.bindEvents();
    });
  },

  bindEvents: function() {
    this.collection.forEach(model => this.addNavigationListener(model));
  },

  addNavigationListener: function(model) {
    chrome.webNavigation.onCompleted.addListener(details => {
      this.injectTab(details.tabId, model.service);
    }, {url: [{hostSuffix: model.domain}]});
  },

  injectTab: function(tab, service) {
    var css = 'styles/' + service + '.css';
    var js = 'scripts/content_' + service + '.js';

    chrome.tabs.insertCSS(tab.id, {file: 'styles/global.css'});
    chrome.tabs.insertCSS(tab.id, {file: css});

    chrome.tabs.executeScript(tab.id, {file: js});
  }

};

injector.initialize();
