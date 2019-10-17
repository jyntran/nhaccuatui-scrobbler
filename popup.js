/* popup.js */

function init() {
	var lastfm, metadata;

	chrome.runtime.getBackgroundPage(function(bg) {
		lastfm = bg.lastfm;
	});

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		if (request.name == 'metadata') {
			metadata = request.data;
			renderNowPlaying();
			//sendResponse({name: 'metadata success'});
		}
		if (request.name == 'scrobbled') {
			renderScrobbleStatus(true);
			sendResponse({name: 'scrobbled success'});
		}
	});

	function renderNowPlaying() {
		if (metadata) {
			document.getElementById('track').innerText = metadata.track;
			document.getElementById('artist').innerText = metadata.artist;
		}
	}

	function renderScrobbleStatus(status) {
		if (status) {
			$('#scrobbled').show();
		} else {
			$('#scrobbled').hide();
		}
	}

	$('#logInButton').click(function() {
		lastfm.login();
	});

	$('#logOutButton').click(function() {
		lastfm.logout();
		location.reload();
	});

	if (!localStorage.getItem('nctscrobble_session_key')) {
        $('#loggedOut').show();
        $('#loginPrompt').show();
		$('#loggedIn').hide();
	} else {
		var name = localStorage.getItem('nctscrobble_session_name');
		var lastfmUrl = 'https://last.fm/user/'+ name;
        $('#loggedOut').hide();
        $('#loginPrompt').hide();
		$('#loggedIn').show();
		$('#userName').text(name);
		$('#lastFMButton').attr('href', lastfmUrl);
	}
}

$(document).ready(init);