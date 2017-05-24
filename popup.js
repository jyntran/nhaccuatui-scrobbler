/* popup.js */

var bp;

window.onload = function() {

	chrome.runtime.getBackgroundPage(function(bg) {
		bp = bg;

		var callback = function(){
		    var logInBtn = document.getElementById('logInButton');
		    logInBtn.addEventListener('click', function() {
				bp.webAuth();
		    });

		    var logOutBtn = document.getElementById('logOutButton');
		    logOutBtn.addEventListener('click', function() {
				bp.logout();
				window.location.reload();
		    });

		    renderAuthState();
		};

		if (
			document.readyState === "complete" ||
			(document.readyState !== "loading" && !document.documentElement.doScroll)
		) {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}

    });

};

function renderAuthState() {
	if (bp.lf.session.key && bp.lf.session.name) {
	    document.getElementById('loggedOut').style.display = 'none';
	    document.getElementById('loggedIn').style.display = 'block';
	    document.getElementById('userName').innerText = bp.lf.session.name;
	} else {
	    document.getElementById('loggedIn').style.display = 'none';
	    document.getElementById('loggedOut').style.display = 'block';
	}
}
