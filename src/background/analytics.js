function createQueueFunction() {
  function ga() {
    ga.q.push(arguments);
  }

  ga.q = [];
  ga.l = +new Date();

  return ga;
}

window.GoogleAnalyticsObject = 'ga';
const ga = window.ga = createQueueFunction();

ga('create', 'UA-63875543-2', 'auto');
ga('set', 'checkProtocolTask', null);

chrome.runtime.onMessage.addListener(function(data) {
  if (data.type !== 'track_event') {
    return;
  }
  ga('send', 'event', data.category, data.action, data.fields);
});
