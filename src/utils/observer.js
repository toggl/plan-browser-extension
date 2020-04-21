import difference from 'lodash.difference';

function Observer(selector, element) {
  this.selector = selector;
  this.attr = null;
  this.element = element ? element : document;
  this.mutationHandlers = [];
  this.seenElements = [];

  const onMutation = this.onMutation.bind(this);
  this.observer = new MutationObserver(onMutation);
}

Observer.prototype.onMutation = function(mutations) {
  const lastMutation = mutations && mutations.pop();
  if (
    this.attr &&
    lastMutation &&
    lastMutation.type === 'attributes' &&
    lastMutation.attributeName !== this.attr
  ) {
    return;
  }

  const oldSeenElements = this.seenElements;
  const newSeenElements = this.findMatchingElements();

  this.mutationHandlers.forEach(function(handler) {
    handler(oldSeenElements, newSeenElements);
  });

  this.seenElements = newSeenElements;
};

Observer.prototype.findMatchingElements = function() {
  const elements = document.querySelectorAll(this.selector);
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

Observer.prototype.onAttributeChanged = function(attributeName, callback) {
  this.attr = attributeName;
  this.mutationHandlers.push(function(oldEls) {
    oldEls.forEach(callback);
  });

  return this;
};

Observer.prototype.start = function() {
  this.observer.observe(this.element, {
    attributes: typeof this.attr === 'string',
    childList: true,
    subtree: true,
  });
  this.onMutation();

  return this;
};

Observer.prototype.stop = function() {
  this.observer.disconnect();

  return this;
};

export const create = function(selector, element) {
  return new Observer(selector, element);
};
