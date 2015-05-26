var difference = require('lodash.difference');

function Observer(selector) {
  this.selector = selector;
  this.mutationHandlers = [];
  this.seenElements = [];

  var onMutation = this.onMutation.bind(this);
  this.observer = new MutationObserver(onMutation);
}

Observer.prototype.onMutation = function() {
  var oldSeenElements = this.seenElements;
  var newSeenElements = this.findMatchingElements();

  this.mutationHandlers.forEach(function(handler) {
    handler(oldSeenElements, newSeenElements);
  });

  this.seenElements = newSeenElements;
};

Observer.prototype.findMatchingElements = function() {
  var elements = document.querySelectorAll(this.selector);
  return Array.prototype.slice.call(elements);
};

Observer.prototype.onAdded = function(callback) {
  this.mutationHandlers.push(function(oldEls, newEls) {
    difference(newEls, oldEls).forEach(callback);
  });

  return this;
};

Observer.prototype.onRemoved = function(callback) {
  this.mutationHandlers.push(function(oldEls, newEls) {
    difference(oldEls, newEls).forEach(callback);
  });

  return this;
};

Observer.prototype.start = function() {
  this.observer.observe(document, { childList: true, subtree: true });
  this.onMutation();
};

exports.create = function(selector) {
  return new Observer(selector);
};
