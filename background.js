/* background.js */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.name == 'scrobble') {
      var r = request.data;
      lastfm.scrobble(r.artist, r.track, r.timestamp, function(resp){
        sendResponse({name:'scrobble response', data: resp});
      });
    }
    return true;
  }
);