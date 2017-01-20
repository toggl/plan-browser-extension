'use strict';

const HashMap = require('hashmap');
const createObserver = require('./observer').create;
const Button = require('../button/button');

exports.observe = function() {
  let args = Array.prototype.slice.call(arguments);

  if (typeof args[0] === 'string') {
    args.unshift(document.documentElement);
  }

  let container = args[0];
  let selector = args[1];
  let setup = args[2];
  let teardown = args[3];

  let values = new HashMap();

  let observer = createObserver(selector, container)
    .onAdded(function(element) {
      let value = setup(element);
      values.set(element, value);
    })
    .onRemoved(function(element) {
      let value = values.get(element);
      teardown(value);
    })
    .start();

  return observer;
};

exports.create = function(options) {
  let button = new Button(options);
  return button;
};

exports.append = function(state, container) {
  let el = state.button.render().el;
  container.appendChild(el);
};

exports.prepend = function(state, container) {
  let el = state.button.render().el;
  container.insertBefore(el, container.firstChild);
};

exports.appendOrReplace = function(state, container) {
  let previousEl = container.querySelector('.tw-button');
  let nextEl = state.button.render().el;

  if (previousEl) {
    container.replaceChild(nextEl, previousEl);
  } else {
    container.appendChild(nextEl);
  }
}

exports.remove = function(state) {
  state.remove();
};
