/* background.js */

var session = {
  key: '',
  name: ''
}

var api_url = 'http://ws.audioscrobbler.com/2.0/';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.name == 'scrobble') {
      var r = request.data;
      scrobble(r.artist, r.track, r.timestamp, function(resp){
        sendResponse({name:'scrobble response', data: resp});
      });
    }
    return true;
  }
);

function _sendRequest(method, params, callback) {
  var uri = api_url;
  var _data = "";
  var _params = [];

  for (param in params) {
        _params.push(encodeURIComponent(param) + "="
          + encodeURIComponent(params[param]));
  }

  switch (method) {
    case "GET":
      uri += '?' + _params.join('&').replace(/%20/, '+');
      break;
    case "POST":
      _data = _params.join('&');
      break;
    default:
      return;
  }

  $.ajax({
    type: method,
    url: uri,
    data: _data,
    dataType: 'json',
    success: function(data) {
      callback(data);
    }
  });
}

function scrobble(artist, track, timestamp, callback) {
  var params = {
    api_key: lastfm_keys.api_key,
    sk: session.key,
    method: 'track.scrobble',
    artist: artist,
    track: track,
    timestamp: timestamp
  };

  params.api_sig = _getSignature(params);
  params.format = 'json';

  _sendRequest('POST', params,
    function(resp) {
      callback(resp);
    }
  );
}

function _getSignature(params) {
  var keys = [];
  var key, i;
  var sig = '';

  for (key in params) {
    keys.push(key);
  }

  for (i in keys.sort()) {
    key = keys[i];
    sig += key + params[key];
  }

  sig += lastfm_keys.api_secret;

  return md5(sig);
}

function authorize(token, callback) {
  var params = {
    api_key: lastfm_keys.api_key,
    method: 'auth.getSession',
    token: token
  };

  params.api_sig = _getSignature(params);
  params.format = 'json';

  _sendRequest('GET', params, function(resp){
    if (resp) {
      callback(resp);
    } else {
      callback();
    }
  });
}

function getSession(token) {
  authorize(token, function(resp) {
    if (resp && resp.session) {
      session = resp.session;
      localStorage.setItem('nctscrobble_session_key', resp.session.key);
      localStorage.setItem('nctscrobble_session_name', resp.session.name);
    }
  });
}