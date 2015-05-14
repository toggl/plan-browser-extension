var api = require('./api/api');

chrome.runtime.onMessage.addListener(function(request, sender, respond) {

  if (request.method == null) {
    respond({ success: false, error: { message: 'no_method' } });
  } else if (!(request.method in api)) {
    respond({ success: false, error: { message: 'invalid_method' }});
  } else {
    var result = api[request.method](request.data);

    Promise.resolve(result)
      .then(function(result) {
        respond({ success: true, result: result });
      }, function(error) {
        respond({ success: false, error: error });
      });

    return true;
  }

});
