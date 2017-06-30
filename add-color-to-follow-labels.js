// ==UserScript==
// @name         Add Color To Follow/Unfollow Buttons on SteemIt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add some color to the Follow/Unfollow buttons on SteemIt!
// @author       netuoso
// @match        https://steemit.com/*
// @grant        WTFPL
// ==/UserScript==

function addColorToFollowLabels() {
	followLabels = document.getElementsByTagName('label');

	for (i=0;i<followLabels.length;i++) {
		if (followLabels[i].innerText === "UNFOLLOW") {
			followLabels[i].style.backgroundColor = "#FF6666";
		} else if (followLabels[i].innerText == "FOLLOW") {
			followLabels[i].style.backgroundColor = "#00FF00";
		}
	}
}

/*--- Note, gmMain () will fire under all these conditions:
    1) The page initially loads or does an HTML reload (F5, etc.).
    2) The scheme, host, or port change.  These all cause the browser to
       load a fresh page.
    3) AJAX changes the URL (even if it does not trigger a new HTML load).
*/
var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function () {
        if ( location.pathname.indexOf('followers') || this.lastPathStr  !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash) ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            gmMain ();
        }
    }, 111
);

function gmMain() {
    addColorToFollowLabels();
}
