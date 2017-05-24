/* lastfm.js */

function LastFM(api_key, api_secret) {
  this.API_KEY = api_key;	
  this.API_SECRET = api_secret;	
  this.API_URL = 'http://ws.audioscrobbler.com/2.0/';
  this.session = {};
}

LastFM.prototype._sendRequest = function(method, params, callback) {
  var uri = this.API_URL;
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

  var xhr = new XMLHttpRequest();
  xhr.open(method, uri);

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4) {
      var resp;

      try {
        resp = JSON.parse(xhr.responseText);
        if (resp.error) {
          console.log('Last.FM ' + params.method + ' error ' + resp.error);
        }
      } catch (e) {
        resp = null;
        console.log('Error parsing JSON response');
        console.log(params);
      }

      callback(resp);
    }
  }

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
  xhr.setRequestHeader("Pragma", "no-cache");
  xhr.send(_data || null);
    }

LastFM.prototype.authorize = function(token, callback) {
  var params = {
    api_key: this.API_KEY,
    method: 'auth.getSession',
    token: token
  };

  params.api_sig = this._getSignature(params);
  params.format = 'json';

      var self = this;

  this._sendRequest('GET', params,
    function(resp) {
      if (resp) {
        self.session.key = resp.session.key;
        self.session.name = resp.session.name;
        callback(resp);
      } else {
        callback();
      }
    }
      );
}

LastFM.prototype.scrobble = function(artist, track, timestamp, callback) {
  var params = {
    api_key: this.API_KEY,
    sk: this.session.key,
    method: 'track.scrobble',
    artist: artist,
    track: track,
    timestamp: timestamp
  };

  params.api_sig = this._getSignature(params);
  params.format = 'json';

  this._sendRequest('POST', params,
    function(resp) {
      callback(resp);
    }
  );
}

LastFM.prototype._getSignature = function(params) {
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

  sig += this.API_SECRET;

  return md5(sig);
}
