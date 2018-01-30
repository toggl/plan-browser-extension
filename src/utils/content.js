const HashMap = require('hashmap');
const createObserver = require('./observer').create;
const Button = require('../button/button');

exports.observe = function() {
  const args = Array.prototype.slice.call(arguments);

  if (typeof args[0] === 'string') {
    args.unshift(document.documentElement);
  }

  const container = args[0];
  const selector = args[1];
  const setup = args[2];
  const teardown = args[3];

  const values = new HashMap();

  const observer = createObserver(selector, container)
    .onAdded(function(element) {
      const value = setup(element);
      values.set(element, value);
    })
    .onRemoved(function(element) {
      const value = values.get(element);
      teardown(value);
    })
    .start();

  return observer;
};

exports.create = function(options) {
  const button = new Button(options);
  return button;
};

exports.append = function(state, container) {
  const el = state.button.render().el;
  container.appendChild(el);
};

exports.prepend = function(state, container) {
  const el = state.button.render().el;
  container.insertBefore(el, container.firstChild);
};

exports.insert = function(state, previous) {
  const el = state.button.render().el;
  const container = previous.parentNode;
  const next = previous.nextSibling;
  container.insertBefore(el, next);
};

exports.appendOrReplace = function(state, container) {
  const previousEl = container.querySelector('.tw-button');
  const nextEl = state.button.render().el;

  if (previousEl) {
    container.replaceChild(nextEl, previousEl);
  } else {
    container.appendChild(nextEl);
  }
};

exports.remove = function(state) {
  state.remove();
};
