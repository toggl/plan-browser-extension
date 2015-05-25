exports.create = function(selector, callback) {
  var seenElements = [];

  var observer = new MutationObserver(runCallbackForMatchingElements);
  observer.observe(document, { childList: true, subtree: true });
  runCallbackForMatchingElements();

  function runCallbackForMatchingElements() {
    var newMatchingElements = findMatchingElements().filter(isNewElement);

    newMatchingElements.forEach(setElementSeen);
    newMatchingElements.forEach(callback);
  }

  function findMatchingElements() {
    var matching = document.querySelectorAll(selector);
    return Array.prototype.slice.call(matching);
  }

  function isNewElement(element) {
    return seenElements.indexOf(element) === -1;
  }

  function setElementSeen(element) {
    seenElements.push(element);
  }
};
