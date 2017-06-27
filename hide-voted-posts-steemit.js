// ==UserScript==
// @name         Hide Voted Posts on Steem
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide already voted posts on SteemIt.com
// @author       netuoso
// @match        https://steemit.com/created*
// @grant        WTFPL
// ==/UserScript==

window.addEventListener('load', function() {
    function hideVotedPosts() {
        // Get all posts votes count
        var elements = document.getElementsByClassName("VotesAndComments__votes");
        // Loop over the posts and hide the entire post if there are votes
        // 0 votes has title of "no votes"
        for (var i=0; i<elements.length; i++) {
            var votes = elements[i].getAttribute('title');
            if (votes !== "no votes") {
                elements[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display="none";
            }
        }
    }

    // Create a button called "Hide Voted Posts"
	var linode = document.createElement("li");
	var linknode = document.createElement("a");
	linknode.innerHTML="hide voted posts";
	linknode.onclick= function() { hideVotedPosts(); };
	linknode.href="#";
	linode.appendChild(linknode);
	// Append the link to the navigation bar on the top of the screen
	document.getElementsByClassName('HorizontalMenu')[0].appendChild(linode);

// If you uncomment the following lines, the already voted posts will automatically hide as you scroll more into view.
//	document.getElementsByClassName("PostsList__summaries")[0].addEventListener("DOMNodeInserted", function(event) {
//		hideVotedPosts();
//	});
});
