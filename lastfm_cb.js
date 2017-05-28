/* lastfm_cb.js */

function _url_param(name, url) {
    return unescape((RegExp(name + '=' +
        '(.+?)(&|$)').exec(url) || [,null])[1]);
}

chrome.runtime.getBackgroundPage(function(bp) {
    bp.lastfm.getSession(_url_param("token", location.search));
    window.close();
});
