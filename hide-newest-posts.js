// ==UserScript==
// @name         Hide Newest Posts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide Posts Newer than 15 Minutes
// @author       netuoso
// @match        https://steemit.com/*
// @grant        WTFPL
// ==/UserScript==

function hidePostsBefore(millisecs=900000) {
	postTimestamps = document.getElementsByClassName('vcard');
	currentTime = Date.parse(Date());

	for (i=0;i<postTimestamps.length;i++) {
		var thisTimestamp = postTimestamps[i].firstChild.firstChild.title;
		if ((currentTime - Date.parse(thisTimestamp)) < millisecs) {
			postTimestamps[i].parentElement.parentElement.parentElement.style.display="none";
		}
	}
}

function showPostsBefore() {
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
        hidePostsBefore();
        document.getElementById("enableTimeFilterLink").style.display = "none";
        document.getElementById("disableTimeFilterLink").style.display = "inline-block";

        // Enable auto filtering
        document.getElementsByClassName("PostsList__summaries")[0].addEventListener("DOMNodeInserted", function(event) {
            hidePostsBefore();
        });
    } else {
        showPostsBefore();
        document.getElementById("disableTimeFilterLink").style.display = "none";
        document.getElementById("enableTimeFilterLink").style.display = "inline-block";

        // Disable auto filtering
        // Enable auto filtering
        document.getElementsByClassName("PostsList__summaries")[0].addEventListener("DOMNodeInserted", function(event) {
            showPostsBefore();
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
    // Create a button called "Hide Newest Posts"
    var enableWrapper = document.createElement("li");
    enableWrapper.id = "enableTimeFilterLink";
    enableWrapper.className = "hideBeforeScript";
    var enableLink = document.createElement("a");
    enableLink.innerHTML = "hide newest posts";
    enableLink.onclick = function() { toggleAutoFilter("enable"); };
    enableLink.style.pointer = "cursor";
    enableWrapper.appendChild(enableLink);

    // Create a button called "Hide Newest Posts"
    var disableWrapper = document.createElement("li");
    disableWrapper.id = "disableTimeFilterLink";
    disableWrapper.className = "hideBeforeScript";
    var disableLink = document.createElement("a");
    disableLink.innerHTML = "show newest posts";
    disableLink.onclick = function() { toggleAutoFilter("disable"); };
    disableLink.style.pointer = "cursor";
    disableWrapper.appendChild(disableLink);
    disableWrapper.style.display = "none";

    try {
        // Append the link to the navigation bar on the top of the screen
        if (window.location.href.indexOf("created") > 0) {
            if (document.getElementsByClassName("hideBeforeScript").length === 0) {
                // Append the link to the navigation bar on the top of the screen
                document.getElementsByClassName('HorizontalMenu')[0].appendChild(enableWrapper);
                document.getElementsByClassName('HorizontalMenu')[0].appendChild(disableWrapper);
            } else {
                document.getElementsByClassName("hideBeforeScript")[0].style.display = "inline-block";
            }
        } else {
            if (document.getElementsByClassName("hideBeforeScript").length > 0) {
                for (i=0;document.getElementsByClassName("hideBeforeScript").length;i++) {
                    document.getElementsByClassName("hideBeforeScript")[i].style.display = "none";
                }
            }
        }
    } catch (e) {}
}
