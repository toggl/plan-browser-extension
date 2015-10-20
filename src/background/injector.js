var find = require('lodash.find');
var CustomDomainCollection = require('../models/custom_domain_collection');

var injector = {

  initialize: function() {
    this.collection = new CustomDomainCollection();
    this.collection.fetch();
  },

  inject: function(tab, service) {
    var css = 'styles/' + service + '.css';
    var js = 'scripts/content_' + service + '.js';

    chrome.tabs.insertCSS(tab.id, {file: 'styles/global.css'});
    chrome.tabs.insertCSS(tab.id, {file: css});

    chrome.tabs.executeScript(tab.id, {file: js});
  },

  process: function(tab) {
    var model = find(this.collection.models, function(model) {
      return tab.url.indexOf(model.domain) > -1;
    });

    if (model != null) {
      this.inject(tab, model.service);
    }
  }

};

chrome.tabs.onUpdated.addListener(function(id, delta, tab) {
  if (delta.status != 'loading') return;
  injector.process(tab);
});

injector.initialize();
