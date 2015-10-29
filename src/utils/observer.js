var difference = require('lodash.difference');

function Observer(selector, element) {
  this.selector = selector;
  this.element = element != null ? element : document;
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
  this.observer.observe(this.element, { childList: true, subtree: true });
  this.onMutation();

  return this;
};

Observer.prototype.stop = function() {
  this.observer.disconnect();

  return this;
};

exports.create = function(selector, element) {
  return new Observer(selector, element);
};
