/* popup.js */

function init() {
	var metadata;

	var loggedOut = $('#loggedOut');
	var loggedIn = $('#loggedIn');

	$('#logInButton').click(function() {
		lastfm.authorize();
	});

	$('#logOutButton').click(function() {
		lastfm.deauthorize();
		location.reload();
	});

	if (!localStorage.getItem('nctscrobble_session_key')) {
		$(loggedOut).show();
		$(loggedIn).hide();
	} else {
		var name = localStorage.getItem('nctscrobble_session_name');
		var lastfmUrl = 'https://last.fm/user/'+ name;
		$(loggedOut).hide();
		$(loggedIn).show();
		$('#userName').text(name);
		$('#lastFMButton').attr('href', lastfmUrl);
	}

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		if (request.name == 'metadata') {
			metadata = request.data;
			renderNowPlaying();
			sendResponse({name: 'metadata success'});
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
			document.getElementById('scrobbled').style.display = 'block';
		} else {
			document.getElementById('scrobbled').style.display = 'none';
		}
	}
}

$(document).ready(init);