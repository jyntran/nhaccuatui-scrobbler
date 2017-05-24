/* background.js */

var lf = new LastFM(CONFIG.api_key, CONFIG.api_secret);

lf.session.key = localStorage['nctscrobble_session_key'] || null;
lf.session.name = localStorage['nctscrobble_session_name'] || null;

function webAuth() {
  var cb = chrome.runtime.getURL(CONFIG.cb_file);
  chrome.tabs.create({
    url: 'http://www.last.fm/api/auth?api_key=' + CONFIG.api_key + '&cb=' + cb
  });
}

function logout() {
  lf.session = {};
  localStorage.removeItem('nctscrobble_session_key');
  localStorage.removeItem('nctscrobble_session_name');
}

function getSession(token) {
  lf.authorize(token, function(resp) {
    if (resp.session) {
      localStorage['nctscrobble_session_key'] = resp.session.key;
      localStorage['nctscrobble_session_name'] = resp.session.name;
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.name == 'scrobble') {
		var r = request.data;
		lf.scrobble(r.artist, r.track, r.timestamp, function(resp){
		  sendResponse({name:'scrobble response', data: resp});
		});
    } return true;
  }
);