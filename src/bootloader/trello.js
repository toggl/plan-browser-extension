var Button = require('../button/button.js');
var btn = Button.initialize();

function onMutation(mutations) {
  mutations.forEach(function(mutation) {
    Array.prototype.forEach.call(mutation.addedNodes, function(node) {
      if (node.matches('.card-detail-window')) createButton(node);
    });
  });
}

function createButton(node) {
  var titleEl = node.querySelector('.window-title');
  var name = titleEl.querySelector('.window-title-text').innerText;

  var buttonEl = Button.create({
    name: name
  });

  var currentListEl = node.querySelector('.js-current-list');
  titleEl.insertBefore(buttonEl, currentListEl.nextSibling);
}

var wrapper = document.querySelector('.window-wrapper');
var observer = new MutationObserver(onMutation);
observer.observe(wrapper, { childList: true });
