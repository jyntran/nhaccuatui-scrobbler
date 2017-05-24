/* contentscript.js */

(function() {

	function getMetadata() {
	    var playerElem = document.getElementById('nameSingerflashPlayer');	    
	    var trackName = playerElem.children[0].children[0].innerText;
	    var artistName = playerElem.children[1].children[0].innerText;

	    return {
	    	track: trackName,
	    	artist: artistName
	    }
	}

	function scrobbleTrack(data) {
		chrome.runtime.sendMessage({
			name: 'scrobble',
			data: {
				track: data.track,
				artist: data.artist,
				timestamp: new Date().getTime() / 1000
			}
		}, function(resp) {
        	if (!resp.error) {
          		console.log('Success: scrobbled the following track: ' + data.artist + ' - ' + data.track);
        	} else {
          		console.log('Error: could not scrobbled the following track: ' + data.artist + ' - ' + data.track);
    		}
			setTimeout(function(){
        	}, 2000);
      	});
	}

	$(document).ready(function(){
		var totalTimeStr, totalTime,
			currentTimeStr, currentTime,
			metadata;
			isScrobbled = false;

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

		function getTotalTime() {
			if ($('#utTotalTimeflashPlayer').text() != totalTimeStr) {
				totalTimeStr = $('#utTotalTimeflashPlayer').text();
				totalTime = hmsToSecondsOnly(totalTimeStr);
				isScrobbled = false;
				metadata = getMetadata();
			}
		}

		function checkCurrentTime() {
			getTotalTime();
			currentTimeStr = $('#utCurrentTimeflashPlayer').text();
			currentTime = hmsToSecondsOnly(currentTimeStr);	
			if (!isScrobbled && isHalfway(totalTime, currentTime)) {
				scrobbleTrack(metadata);
				isScrobbled = true;
			}
		}

		$('#playerMp3flashPlayer').ready(function(){
			$('body').on('DOMSubtreeModified', '#utCurrentTimeflashPlayer', checkCurrentTime);
		});
	});

})();