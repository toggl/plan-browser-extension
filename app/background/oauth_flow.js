chrome.runtime.onMessage.addListener(function(request, sender, respond) {
  if (request.type === 'oauth_flow') {
    console.log('Launching OAuth flow:', request.url);
    chrome.identity.launchWebAuthFlow({ url: request.url, interactive: true }, respond);
    return true;
  }
});
