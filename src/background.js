var api = require('./api/api');

chrome.runtime.onMessage.addListener(function(request, sender, respond) {

  if (request.type == 'is_authenticated') {
    respond({ result: api.isAuthenticated() });
  }

  if (request.type == 'authenticate') {
    var username = request.data.username;
    var password = request.data.password;

    api.authenticate(username, password)
      .then(function() {
        respond({ success: true });
      }, function(error) {
        respond({ success: false, error: error })
      });
  }

  if (request.type == 'add_task') {
    api.addTask(request.data)
      .then(function() {
        respond({ success: true });
      }, function(error) {
        respond({ success: false, error: error })
      });
  }

});
