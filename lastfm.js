/* lastfm.js */

var lastfm = {
	authorize: authorize,
	deauthorize: deauthorize
};

function authorize() {
	var cb = chrome.runtime.getURL(lastfm_keys.cb_file);
	chrome.tabs.create({
	    url: 'http://www.last.fm/api/auth?api_key=' + lastfm_keys.api_key + '&cb=' + cb
	});
}

function deauthorize() {
	localStorage.removeItem('nctscrobble_session_key');
	localStorage.removeItem('nctscrobble_session_name');
}