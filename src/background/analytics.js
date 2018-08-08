const superagent = require('superagent');
const GA_TRACKING_ID = 'UA-63875543-2';
const GA_CLIENT_ID = +new Date();

ga({
  t: 'pageview'
});

chrome.runtime.onMessage.addListener(function(data) {
  if (data.type !== 'track_event') {
    return;
  }
  ga({
    t: 'event',
    ec: data.category,
    ea: data.action,
    el: data.fields // label,
  });
});

function ga(data) {
  superagent
    .post('https://www.google-analytics.com/collect')
    .send(
      Object.assign(
        {},
        {
          v: 1,
          tid: GA_TRACKING_ID,
          cid: GA_CLIENT_ID,
          aip: 1,
          ds: 'add-on',
          t: 'event'
        },
        data
      )
    )
    .end((err, response) => {
      if (err) {
        console.error(err);
      } else {
        console.log(response.body);
      }
    });
}
