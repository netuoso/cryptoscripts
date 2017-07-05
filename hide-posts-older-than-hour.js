// ==UserScript==
// @name         Hide Oldest Posts on Trending
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide Posts Older than 1 Hour on Trending Page
// @author       netuoso
// @match        https://steemit.com/*
// @grant        WTFPL
// ==/UserScript==

function hidePostsAfter(millisecs=3600000) {
	postTimestamps = document.getElementsByClassName('vcard');
	currentTime = Date.parse(Date());

	for (i=0;i<postTimestamps.length;i++) {
		var thisTimestamp = postTimestamps[i].firstChild.firstChild.title;
		if ((currentTime - Date.parse(thisTimestamp)) >= millisecs) {
			postTimestamps[i].parentElement.parentElement.parentElement.style.display="none";
		}
	}
}

function showPostsAfter() {
    // Get all posts
    var elements = document.getElementsByClassName("PostSummary");
    var footerElements = document.getElementsByClassName("PostSummary__footer");
    // Loop over the posts and unhide them
    for (var i=0; i<elements.length; i++) {
        elements[i].parentElement.style.display="list-item";
        footerElements[i].style.display = "list-item";
    }
}

function toggleAutoFilter(setting) {
    if (setting == "enable" ) {
        hidePostsAfter();
        document.getElementById("enableHideAfterLink").style.display = "none";
        document.getElementById("disableTimeAfterLink").style.display = "inline-block";

        // Enable auto filtering
        document.getElementsByClassName("PostsList__summaries")[0].addEventListener("DOMNodeInserted", function(event) {
            hidePostsAfter();
        });
    } else {
        showPostsAfter();
        document.getElementById("disableTimeAfterLink").style.display = "none";
        document.getElementById("enableHideAfterLink").style.display = "inline-block";

        // Disable auto filtering
        // Enable auto filtering
        document.getElementsByClassName("PostsList__summaries")[0].addEventListener("DOMNodeInserted", function(event) {
            showPostsAfter();
        });
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
        if ( this.lastPathStr  !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash) ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            gmMain ();
        }
    }, 111
);

function gmMain () {
    // Create a button called "Hide Oldest Posts"
    var enableWrapper = document.createElement("li");
    enableWrapper.id = "enableHideAfterLink";
    enableWrapper.className = "hideAfterScript";
    var enableLink = document.createElement("a");
    enableLink.innerHTML = "hide old posts";
    enableLink.onclick = function() { toggleAutoFilter("enable"); };
    enableLink.style.pointer = "cursor";
    enableWrapper.appendChild(enableLink);

    // Create a button called "Hide Oldest Posts"
    var disableWrapper = document.createElement("li");
    disableWrapper.id = "disableTimeAfterLink";
    disableWrapper.className = "hideAfterScript";
    var disableLink = document.createElement("a");
    disableLink.innerHTML = "show old posts";
    disableLink.onclick = function() { toggleAutoFilter("disable"); };
    disableLink.style.pointer = "cursor";
    disableWrapper.appendChild(disableLink);
    disableWrapper.style.display = "none";

    try {
        // Append the link to the navigation bar on the top of the screen
        if (window.location.href.indexOf("trending") > 0) {
            if (document.getElementsByClassName("hideAfterScript").length === 0) {
                // Append the link to the navigation bar on the top of the screen
                document.getElementsByClassName('HorizontalMenu')[0].appendChild(enableWrapper);
                document.getElementsByClassName('HorizontalMenu')[0].appendChild(disableWrapper);
            } else {
                document.getElementsByClassName("hideAfterScript")[0].style.display = "inline-block";
            }
        } else {
            if (document.getElementsByClassName("hideAfterScript").length > 0) {
                for (i=0;document.getElementsByClassName("hideAfterScript").length;i++) {
                    document.getElementsByClassName("hideAfterScript")[i].style.display = "none";
                }
            }
        }
    } catch (e) {}
}
