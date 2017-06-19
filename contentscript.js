/* contentscript.js */

(function() {

	$(document).ready(function(){
		var totalTimeStr, totalTime,
			currentTimeStr, currentTime,
			metadata,
			isScrobbled = false;

		function onSongPage() {
			return window.location.href.indexOf('nhaccuatui.com/bai-hat/') > -1;
		}

		function onPlaylistPage() {
			return window.location.href.indexOf('nhaccuatui.com/playlist/') > -1;
		}

		function onVideoPage() {
			return window.location.href.indexOf('nhaccuatui.com/video/') > -1;
		}

		function getCurrentTime() {
			return $('.utCurrentTime')
		}

		function getTotalTime() {
			return $('.utTotalTime')
		}

		function getTrackName() {
			if (onSongPage() || onVideoPage()) {
				const elem = document.getElementsByClassName('name_title')[0];
				return elem.children[0].innerText;
			} else if (onPlaylistPage()) {
		    const elem = document.getElementById('nameSingerflashPlayer');	    
				return elem.children[0].children[0].innerText
			}
		}

		function getArtistName() {
			if (onSongPage() || onVideoPage()) {
				const elem = document.getElementsByClassName('name_title')[0];
				return elem.children[2].children[0].innerText;
			} else if (onPlaylistPage()) {
		    const elem = document.getElementById('nameSingerflashPlayer');	    
		    return elem.children[1].children[0].innerText;
		  }
		}

		function getMetadata() {
			var trackName = getTrackName()
			var artistName = getArtistName()
		    var metadata = {
		    	track: trackName,
		    	artist: artistName
		    };
		    chrome.runtime.sendMessage({
		    	name: "metadata",
		    	data: metadata
		    }, function(resp) {
		    	//console.log('getMetadata', resp);
			});
		    return metadata;
		}

		function scrobbleTrack(data) {
			var obj = {
				track: data.track,
				artist: data.artist,
				timestamp: new Date().getTime() / 1000
			};
			chrome.runtime.sendMessage({
				name: 'scrobble',
				data: obj
			}, function(resp) {
	        	if (!resp.data.error) {
	          		isScrobbled = true;
	          		//console.log('Success: scrobbled the following track: ' + data.artist + ' - ' + data.track);
	        	} else {
	          		//console.log('Error: could not scrobbled the following track: ' + data.artist + ' - ' + data.track);
	    		}
	      	});
		}

		/* https://stackoverflow.com/a/9640417 */
		function hmsToSecondsOnly(str) {
		    var p = str.split(':'),
		        s = 0, m = 1;
		    while (p.length > 0) {
		        s += m * parseInt(p.pop(), 10);
		        m *= 60;
		    }
		    return s;
		}

		function isHalfway(total, current) {
			return current >= (total/2);
		}

		function checkTotalTime() {
			var total = getTotalTime()
			if (total.text() != totalTimeStr) {
				totalTimeStr = total.text();
				totalTime = hmsToSecondsOnly(totalTimeStr);
				isScrobbled = false;
				metadata = getMetadata();
			}
		}

		function checkCurrentTime() {
			checkTotalTime()
			metadata = getMetadata();
			currentTimeStr = getCurrentTime().text();
			currentTime = hmsToSecondsOnly(currentTimeStr);	
			if (!isScrobbled && isHalfway(totalTime, currentTime)) {
				scrobbleTrack(metadata);
			} else
			if (isScrobbled) {
				// TODO: prevent message from being sent multiple times afterward
				chrome.runtime.sendMessage({
					name: 'scrobbled',
					data: metadata
				}, function(resp) {
					//console.log(resp);
				});
			}
		}

		$('#playerMp3flashPlayer').ready(function(){
			$('body').on('DOMSubtreeModified', '.utCurrentTime', checkCurrentTime);
		});

		$('#videonctPlayer').ready(function(){
			$('body').on('DOMSubtreeModified', '.utCurrentTime', checkCurrentTime);
		});
	});

})();